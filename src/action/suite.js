import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { version, handleException, saveProject } from "./helpers";
import uniqid from "uniqid";
import DEFAULT_STATE from "reducer/defaultState";
import { InvalidArgumentError } from "error";
import { dateToTs, result } from "service/utils";
import errorActions from "./error";
import { writeSuite, readSuite, removeSuite, normalizeFilename } from "../service/io";
import { ipcRenderer } from "electron";
import { E_SUITE_LOADED, SNIPPETS_FILENAME, SNIPPETS_GROUP_ID } from "constant";
import projectActions from "./project";
import appActions from "./app";
import targetActions from "./target";
import groupActions from "./group";
import testActions from "./test";
import commandActions from "./command";
import snippetsActions from "./snippets";
import { message } from "antd";



const actions = createActions({
        SET_SUITE: ( options ) => validate( options, I.SUITE_OPTIONS ),
        RESET_SUITE: ( options ) => options
      });

let autosaveTimeout;


actions.updateSuite = ( suite ) => ( dispatch ) => {
  dispatch( projectActions.setProject({ modified: true }) );
  dispatch( actions.setSuite( suite ) );
};

actions.autosaveSuite = () => ( dispatch, getState ) => {

  const store = getState(),
        autosaveSuite = () => {
          autosaveTimeout = null;
          dispatch( actions.setSuite({ savedAt: dateToTs(), modified: false }) );
          dispatch( actions.saveSuite( {}, true ) );
          saveProject( store );
          message.destroy();
          message.info( `Data saved!` );
        };

  if ( result( store.settings, "autosave", true ) && store.settings.projectDirectory && store.suite.filename ) {
    clearTimeout( autosaveTimeout );
    autosaveTimeout = setTimeout( autosaveSuite, 1500 );
  }

};

actions.removeSuite = ( filename ) => async ( dispatch, getState ) => {
  if ( !filename || typeof filename !== "string" ) {
    throw new InvalidArgumentError( "Filename is not a string or empty" );
  }
  const { projectDirectory } = getState().settings;
  removeSuite( projectDirectory, filename );
};

// SUITE

actions.createSuite = ( rawFilename, title ) => async ( dispatch, getState ) => {
  if ( !rawFilename || typeof rawFilename !== "string" ) {
    throw new InvalidArgumentError( "Filename is not a string or empty" );
  }
  if ( !title || typeof title !== "string" ) {
    throw new InvalidArgumentError( "Title is not a string or empty" );
  }
  const { projectDirectory } = getState().settings,
        filename = normalizeFilename( rawFilename ) + ".json",
        suite = { ...DEFAULT_STATE.suite, filename, title, savedAt: dateToTs() };
  try {
    if ( !projectDirectory ) {
      throw new InvalidArgumentError( "Empty project directory" );
    }
    await writeSuite( projectDirectory, filename, JSON.stringify( suite, null, "  " ) );
    dispatch( actions.openSuiteFile( filename ) );

  } catch ( e ) {
    dispatch( errorActions.setError({
      visible: true,
      message: "Internal Error",
      description: e.message
    }) );
  }
};

function createSnippetsSuite( dispatch ) {
  dispatch( groupActions.addGroup({ title: "Snippets" }, SNIPPETS_GROUP_ID ) );
  dispatch( projectActions.setProject({
    groups: {
      [ SNIPPETS_GROUP_ID ]: {
        key: SNIPPETS_GROUP_ID,
        value: true,
        tests: {}
      }
    }
  }) );
}

function normalizeSuite( suite ) {
  Object.entries( suite.groups ).forEach( gPairs => {
    const [ gid, group ] = gPairs;
    Object.entries( group.tests ).forEach( tPairs => {
      const [ tid, test ] = tPairs;
      Object.entries( test.commands ).forEach( cPairs => {
        const [ cid, command ] = cPairs;
        if ( !command.target && !command.method && !command.ref ) {
          delete suite.groups[ gid ].tests[ tid ].commands[ cid ];
        }
      });
    });
  });
  return suite;
}

actions.loadSuite = ( filename, options = { silent: false }) => async ( dispatch, getState ) => {
  try {
    const store = getState(),
          { projectDirectory } = store.settings,
          data = await readSuite( projectDirectory, filename ),
          // in case of snippets
          suite = data === null
            ? { ...DEFAULT_STATE.suite, filename }
            : normalizeSuite( data );

    suite.snippets = ( filename === SNIPPETS_FILENAME );

    dispatch( projectActions.setProject({ lastOpenSuite: filename }) );
    dispatch( actions.resetSuite({ ...suite, loadedAt: dateToTs(), filename, modified: false }) );
    ipcRenderer.send( E_SUITE_LOADED, projectDirectory, filename, store.app.project.files );
    if ( suite.snippets && !( SNIPPETS_GROUP_ID in suite.groups ) ) {
      createSnippetsSuite( dispatch );
    }
    dispatch( appActions.addAppTab( "suite" ) );
    if ( result( store.settings, "autosave", true ) && store.settings.projectDirectory ) {
      saveProject( store );
    }
  } catch ( ex ) {
    !options.silent && handleException( ex, dispatch, `Cannot load suite ${ filename }` );
  }

};

actions.saveSuite = ( options = {}, autosave = false ) => async ( dispatch, getState ) => {
  const store = getState(),
        { projectDirectory } = store.settings,
        { filename } = { ...store.suite, ...options };
  try {
    if ( !filename ) {
      throw new InvalidArgumentError( "Empty suite filename" );
    }
    if ( !projectDirectory ) {
      throw new InvalidArgumentError( "Empty project directory" );
    }
    const data = { ...store.suite, puppetry: version };
    await writeSuite( projectDirectory, filename, JSON.stringify( data, null, "  " ) );

    await saveProject( store );

    if ( !autosave ) {
      dispatch( actions.updateSuite({ savedAt: dateToTs(), modified: false }) );
    }

    if ( store.suite.snippets ) {
      await dispatch( snippetsActions.resetSnippets({
        targets: store.suite.targets,
        groups: store.suite.groups
      }) );
    }

  } catch ( e ) {
    dispatch( errorActions.setError({
      visible: true,
      message: "Internal Error",
      description: e.message
    }) );
  }
};

actions.openSuiteFile = ( filename, options = { silent: false }) => ( dispatch ) => {
  dispatch( appActions.setApp({ loading: true }) );
  dispatch( actions.loadSuite( filename, options ) );
  dispatch( appActions.setApp({ loading: false }) );
};


actions.createSuiteByRecording = ({ targets, commands }) => ( dispatch ) => {
  const groupId = uniqid(),
        testId = uniqid();

  // fully reset suite after recording session
  dispatch( actions.updateSuite({
    modified: true,
    targets: {},
    groups: {}
  }) );

  dispatch( appActions.setApp({ loading: true }) );
  setTimeout( () => {
    try {
      // Seed targets
      Object.entries( targets ).forEach( ([ target, selector ]) => {
        dispatch( targetActions.addTarget({ target, selector }) );
      });
      dispatch( groupActions.addGroup({ title: "Recorded session" }, groupId ) );
      dispatch( testActions.addTest({ title: "Recorded test case", groupId }, testId ) );
      // Seed commands
      commands.forEach( ({ method, target, params }) => {

        dispatch( commandActions.addCommand({
          target,
          method,
          params,
          groupId,
          testId
        }) );
      });

      dispatch( appActions.setApp({ loading: false }) );
    } catch ( ex ) {
      handleException( ex, dispatch, "Cannot create suite by recording" );
    }

  }, 100 );


};


export default actions;