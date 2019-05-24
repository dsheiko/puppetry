import log from "electron-log";
import uniqid from "uniqid";
import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";

import { writeSuite, readSuite, removeSuite,
  getProjectFiles, writeProject, writeGit,
  readProject, removeRuntimeTestPath,
  isRuntimeTestPathReady,
  copyProject,
  readGit,
  isGitInitialized,
  normalizeFilename } from "../service/io";
import { closeApp, dateToTs } from "service/utils";
import { InvalidArgumentError } from "error";
import DEFAULT_STATE from "reducer/defaultState";
import { ipcRenderer, remote } from "electron";
import { E_FILE_NAVIGATOR_UPDATED, E_WATCH_FILE_NAVIGATOR,
  E_PROJECT_LOADED, E_SUITE_LOADED, E_SUITE_LIST_UPDATED,
  E_GIT_CURRENT_BRANCH, E_GIT_CURRENT_BRANCH_RESPONSE, E_CHECKOUT_MASTER_OPEN } from "constant";
import { getDateString, checkNewVersion } from "../service/http";
import debounce from "lodash.debounce";
import mediator from "service/mediator";


const STORAGE_KEY_SETTINGS = "settings",

      version = remote ? remote.app.getVersion() : "0.1",

      actions = createActions({

        SET_SETTINGS: ( options ) => options,

        ADD_SETTINGS_PROJECT: ( options ) => options,

        REMOVE_SETTINGS_PROJECT: ( options ) => options,

        SET_GIT: ( options ) => options,

        SET_ERROR: ( options ) => validate( options, I.ERROR_OPTIONS ),

        /**
         * @param {object} options = { loading, newProjectModal, testReportModal, project }
         * @returns {object}
         */
        UPDATE_APP: ( options ) => options,

        ADD_APP_TAB: ( tabKey ) => validate( tabKey, "string" ),

        REMOVE_APP_TAB: ( tabKey ) => validate( tabKey, "string" ),

        SET_APP_TAB: ( tabKey ) => validate( tabKey, "string" ),

        SET_PROJECT: ( options ) => options,

        UPDATE_PROJECT_PANES: ( panel, panes ) => ({ panel, panes }),

        SET_SUITE: ( options ) => validate( options, I.UPDATE_SUITE_OPTIONS ),

        RESET_SUITE: ( options ) => validate( options, I.UPDATE_SUITE_OPTIONS ),

        SWAP_TARGET: ( options ) => validate( options, I.SWAP_BASE_OPTIONS ),

        SWAP_COMMAND: ( options ) => validate( options, { ...I.SWAP_BASE_OPTIONS, ...I.COMMAND_REF }),

        SWAP_TEST: ( options ) => validate( options, { ...I.SWAP_BASE_OPTIONS, ...I.TEST_REF }),

        SWAP_GROUP: ( options ) => validate( options, I.SWAP_BASE_OPTIONS ),

        /**
         * @param {object} options = { title, editing }
         * @returns {object}
         */
        UPDATE_SUITE: ( options ) => validate( options, I.UPDATE_SUITE_OPTIONS ),

        CLEAR_TARGET: ( options ) => options,

        /**
         * @param {object} options = { target, selector, editing }
         * @param {object} [id] - injected id for new entity
         * @returns {object}
         */
        ADD_TARGET: ( options, id = null ) => ({
          options: validate( options, { ...I.ENTITY, ...I.TARGET }),
          id: validate( id, I.ID_REF )
        }),
        /**
         * @param {object} options = { title, editing }
         * @param {object} position = { "after": ID }
         * @param {object} [id] - injected id for new entity
         * @returns {object}
         */
        INSERT_ADJACENT_TARGET: ( options, position, id = null ) => ({
          position,
          options,
          id
        }),
        /**
         * @param {object} options = { id, target, selector, editing }
         * @returns {object}
         */
        UPDATE_TARGET: ( options ) => validate( options, { ...I.ENTITY, ...I.TARGET, ...I.UPDATE }),
        /**
         * @param {object} ref = { id }
         * @returns {object}
         */
        REMOVE_TARGET: ( ref ) => validate( ref, { ...I.UPDATE }),
        /**
         * @param {object} options = { title, editing }
         * @param {object} [id] - injected id for new entity
         * @returns {object}
         */
        ADD_GROUP: ( options, id = null ) => ({
          options: validate( options, { ...I.ENTITY, ...I.GROUP }),
          id: validate( id, I.ID_REF )
        }),
        /**
         * @param {object} options = { title, editing }
         * @param {object} position = { "after": ID }
         * @param {object} [id] - injected id for new entity
         * @returns {object}
         */
        INSERT_ADJACENT_GROUP: ( options, position, id = null ) => ({
          position,
          options,
          id
        }),
        /**
         * @param {object} options = { id, title, editing }
         * @returns {object}
         */
        UPDATE_GROUP: ( options ) => validate( options, { ...I.ENTITY, ...I.GROUP, ...I.UPDATE }),
        /**
         * @param {object} ref = { id }
         * @returns {object}
         */
        REMOVE_GROUP: ( ref ) => validate( ref, { ...I.UPDATE }),
        /**
         * @param {object} options = { groupId, title, editing }
         * @param {object} [id] - injected id for new entity
         * @returns {object}
         */
        ADD_TEST: ( options, id = null ) =>  ({
          options: validate( options, { ...I.ENTITY, ...I.TEST }),
          id: validate( id, I.ID_REF )
        }),
        /**
         * @param {object} options = { title, editing }
         * @param {object} position = { "after": ID }
         * @param {object} [id] - injected id for new entity
         * @returns {object}
         */
        INSERT_ADJACENT_TEST: ( options, position, id = null ) => ({
          position,
          options,
          id
        }),
        /**
         * @param {object} options = { groupId, id, title, editing }
         * @returns {object}
         */
        UPDATE_TEST: ( options ) => validate( options, { ...I.ENTITY, ...I.TEST, ...I.UPDATE }),
        /**
         * @param {object} ref = { groupId, id }
         * @returns {object}
         */
        REMOVE_TEST: ( ref ) => validate( ref, { ...I.UPDATE, ...I.TEST_REF }),
        /**
         * @param {object} options = { testId, groupId, target, method, editing }
         * @returns {object}
         */
        ADD_COMMAND: ( options ) => validate( options, { ...I.ENTITY, ...I.COMMAND }),
        /**
         * @param {object} options = { title, editing }
         * @param {object} position = { "after": ID }
         * @returns {object}
         */
        INSERT_ADJACENT_COMMAND: ( options, position ) => ({
          position,
          options
        }),
        /**
         * @param {object} options = { testId, groupId, id, target, method, editing }
         * @returns {object}
         */
        UPDATE_COMMAND: ( options ) => validate( options, { ...I.ENTITY, ...I.COMMAND, ...I.UPDATE }),
        /**
         * @param {object} ref = { testId, groupId, id }
         * @returns {object}
         */
        REMOVE_COMMAND: ( ref ) => validate( ref, { ...I.UPDATE, ...I.COMMAND_REF })
      });

/**
 * Thunk actions
 */

// SETTINGS

actions.saveSettings = ( payload ) => ( dispatch, getState ) => {
  try {
    const settings = { ...getState().settings, ...payload };
    localStorage.setItem( STORAGE_KEY_SETTINGS, JSON.stringify( settings ) );
    dispatch( actions.setSettings( settings ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot save settings" );
  }

};

actions.loadSettings = () => ( dispatch, getState ) => {
  try {
    const saved = process.env.PUPPETRY_CLEAN_START
            ? {}
            : JSON.parse( localStorage.getItem( STORAGE_KEY_SETTINGS ) || "{}" ),
          settings = { ...getState().settings, ...saved };
    dispatch( actions.setSettings( settings ) );
    return settings;
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot load settings" );
  }

};

// GIT

actions.saveGit = ( options ) => async ( dispatch, getState ) => {
  try {
    await dispatch( actions.setGit( options ) );
    await saveGit( getState() );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot save Git" );
  }

};

actions.loadGit = ( directory = null ) => async ( dispatch, getState ) => {
  const projectDirectory = directory || getState().settings.projectDirectory;
  try {
    const data = await readGit( projectDirectory );
    dispatch( actions.setGit( data ) );
  } catch ( err ) {
    // user has not git settings
  }
};

actions.checkGit = ( projectDirectory ) => async ( dispatch ) => {
  ipcRenderer.removeAllListeners( E_GIT_CURRENT_BRANCH_RESPONSE );
  ipcRenderer.on( E_GIT_CURRENT_BRANCH_RESPONSE, ( ev, branch ) => {
    if ( branch !== "master" ) {
      dispatch( actions.updateApp({ gitDetachedHeadState: true }) );
      mediator.emit( E_CHECKOUT_MASTER_OPEN, branch );
    }
  });
  ipcRenderer.send( E_GIT_CURRENT_BRANCH, projectDirectory );
};

// PROJECT

actions.loadProject = ( directory = null ) => async ( dispatch, getState ) => {
  const projectDirectory = directory || getState().settings.projectDirectory;
  let project;
  if ( !projectDirectory ) {
    throw new InvalidArgumentError( "Empty project directory" );
  }
  try {
    dispatch( actions.updateApp({ loading: true }) );
    project = await readProject( projectDirectory );
    ipcRenderer.send( E_PROJECT_LOADED, projectDirectory );

    directory && dispatch( actions.saveSettings({ projectDirectory }) );
    dispatch( actions.setProject( project ) );
    dispatch( actions.loadGit( projectDirectory ) );
    dispatch( actions.loadProjectFiles( projectDirectory ) );
    dispatch( actions.watchProjectFiles( projectDirectory ) );

    // keep track of recent projects
    dispatch( actions.addSettingsProject({
      dir: projectDirectory,
      name: project.name
    }) );
    dispatch( actions.saveSettings() );

    dispatch( actions.setGit({ initialized: isGitInitialized( projectDirectory ) }) );

    project.lastOpenSuite && dispatch( await actions.openSuiteFile( project.lastOpenSuite ) );
  } catch ( err ) {
    log.warn( `Renderer process: actions.loadProject(${projectDirectory }): ${ err }` );
  } finally {
    dispatch( actions.updateApp({ loading: false }) );
  }

  return project;
};

actions.watchProjectFiles = ( directory = null ) => async ( dispatch, getState ) => {
  const projectDirectory = directory || getState().settings.projectDirectory;
  // We have to subscribe every time, because it's bound to EVENt sent with ipcRenderer.send
  ipcRenderer.removeAllListeners( "E_FILE_NAVIGATOR_UPDATED" );
  ipcRenderer.on( E_FILE_NAVIGATOR_UPDATED, debounce( () => {
    dispatch( actions.loadProjectFiles( projectDirectory ) );
  }, 300 ) );
  ipcRenderer.send( E_WATCH_FILE_NAVIGATOR, projectDirectory );
};

actions.loadProjectFiles = ( directory = null ) => async ( dispatch, getState ) => {
  try {
    const store = getState(),
          projectDirectory = directory || store.settings.projectDirectory,
          files = await getProjectFiles( projectDirectory );
    ipcRenderer.send( E_SUITE_LIST_UPDATED, projectDirectory, store.suite.filename, files );
    dispatch( actions.updateApp({ project: { files }}) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot load project files" );
  }

};

actions.saveProject = ({ projectDirectory, name }) => async ( dispatch, getState ) => {
  try {
    if ( !name ) {
      throw new InvalidArgumentError( "Empty project name" );
    }
    if ( !projectDirectory ) {
      throw new InvalidArgumentError( "Empty project directory" );
    }

    await dispatch( actions.setProject({ projectDirectory, name }) );
    await saveProject( getState() );
    await dispatch( actions.loadProjectFiles( projectDirectory ) );
    await dispatch( actions.watchProjectFiles( projectDirectory ) );
    await dispatch( actions.removeAppTab( "suite" ) );

  } catch ( e ) {
    dispatch( actions.setError({
      visible: true,
      message: "Cannot save project",
      description: e.message
    }) );
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
    dispatch( actions.setError({
      visible: true,
      message: "Internal Error",
      description: e.message
    }) );
  }
};

actions.loadSuite = ( filename ) => async ( dispatch, getState ) => {
  try {
    const store = getState(),
          { projectDirectory } = store.settings,
          suite = await readSuite( projectDirectory, filename );
    dispatch( actions.setProject({ lastOpenSuite: filename }) );
    dispatch( actions.resetSuite({ ...suite, loadedAt: dateToTs(), filename, modified: false }) );
    ipcRenderer.send( E_SUITE_LOADED, projectDirectory, filename, store.app.project.files );
    dispatch( actions.addAppTab( "suite" ) );
  } catch ( ex ) {
    handleException( ex, dispatch, `Cannot load suite ${ filename }` );
  }

};

actions.saveSuite = ( options = {}) => async ( dispatch, getState ) => {
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

    dispatch( actions.updateSuite({ savedAt: dateToTs(), modified: false }) );
  } catch ( e ) {
    dispatch( actions.setError({
      visible: true,
      message: "Internal Error",
      description: e.message
    }) );
  }
};

actions.openSuiteFile = ( filename ) => ( dispatch ) => {
  dispatch( actions.updateApp({ loading: true }) );
  try {
    dispatch( actions.loadSuite( filename ) );
  } catch ( e ) {
    dispatch( actions.setError({
      visible: true,
      message: "Cannot open file",
      description: e.message
    }) );
    log.warn( `Renderer process: actions.openSuiteFile: ${ e }` );
  }
  dispatch( actions.updateApp({ loading: false }) );
};

// APP

actions.setLoadingFor = ( ms ) => async ( dispatch ) => {
  dispatch( actions.updateApp({ loading: true }) );
  setTimeout( () => {
    dispatch( actions.updateApp({ loading: false }) );
  }, ms );
};

actions.checkNewVersion = () => async ( dispatch, getState ) => {
  try {
    const { settings } = getState(),
          checkDate = getDateString();
    // Only once a day
    if ( settings.checkDate !== checkDate ) {
      await checkNewVersion( settings.lastCheckedVersion );
    }
    return dispatch( actions.saveSettings({ checkDate }) );
  } catch ( ex ) {
    console.error( ex );
  }

};

actions.closeApp = () => async ( dispatch, getState ) => {
  try {
    const store = getState();
    try {
      await saveProject( store );
    } catch ( e ) {
      noop( e );
    }
    closeApp();
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot close app" );
  }
};

// MISC

/**
 *
 * @returns {Function}
 */
actions.resetCommandFailures = () => async ( dispatch, getState ) => {
  try {
    const { groups } = getState().suite;
    Object.values( groups ).forEach( ( group ) => {
      Object.values( group.tests ).forEach( ( test ) => {
        const matches = Object.values( test.commands ).filter( command => Boolean( command.failure ) );
        matches.forEach( ({ id, testId, groupId }) => dispatch(
          actions.updateCommand({ id, testId, groupId, failure: "" })
        ) );
      });
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot reset command failuries" );
  }

};


actions.pasteTarget = ( payload, dest ) => async ( dispatch ) => {
  try {
    const position = { after: dest.id };
    dispatch( actions.insertAdjacentTarget( payload, position ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste target" );
  }

};

actions.pasteCommand = ( payload, dest ) => async ( dispatch ) => {
  try {
    const merged = { ...payload, testId: dest.testId, groupId: dest.groupId },
          position = { after: dest.id };
    dispatch( actions.insertAdjacentCommand( merged, position ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paster command" );
  }

};


/**
 * @param {Object} payload - clipboard DTO
 * @param {GroupEntity} dest
 */
actions.pasteTest = ( payload, dest ) => async ( dispatch ) => {
  try {
    const id = uniqid(),
          merged = { ...payload, groupId: dest.groupId },
          position = { after: dest.id };
    dispatch( actions.insertAdjacentTest( merged, position, id ) );
    Object.values( payload.commands ).forEach( command => {
      dispatch( actions.addCommand({ ...command, testId: id, groupId: merged.groupId }) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste test" );
  }

};

actions.pasteGroup = ( payload, dest ) => async ( dispatch ) => {
  try {
    const groupId = uniqid(),
          merged = { ...payload },
          position = { after: dest.id };
    dispatch( actions.insertAdjacentGroup( merged, position, groupId ) );
    Object.values( payload.tests ).forEach( test => {
      const testId = uniqid();
      dispatch( actions.addTest({ ...test, groupId: groupId }, testId ) );
      Object.values( test.commands ).forEach( command => {
        dispatch( actions.addCommand({ ...command, testId, groupId }) );
      });
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste group" );
  }

};

/**
 * Clone command within the same test
 * @param {Object} command
 * @param {Object} [options] - e.g. { testId: "", groupId: "" }
 * @returns {Function}
 */
actions.cloneCommand = ( command, options = {}) => async ( dispatch, getState ) => {
  try {
    const groups = getState().suite.groups,
          source = groups[ command.groupId ].tests[ command.testId ].commands[ command.id ],
          merged = { ...source, ...options },
          position = { after: command.id };
    dispatch( actions.insertAdjacentCommand( merged, position ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone command" );
  }

};

/**
 * Clone test within the same group
 * @param {Object} test
 * @param {Object} [options] - e.g. { groupId: "" }
 * @returns {Function}
 */
actions.cloneTest = ( test, options = {}) => async ( dispatch, getState ) => {
  try {
    const groups = getState().suite.groups,
          source = groups[ test.groupId ].tests[ test.id ],
          id = uniqid(),
          merged = { ...source, ...options },
          position = { after: test.id };
    dispatch( actions.insertAdjacentTest( merged, position, id ) );
    Object.values( source.commands ).forEach( command => {
      dispatch( actions.addCommand({ ...command, testId: id, groupId: merged.groupId }) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone test" );
  }

};

/**
 * @private meant to be used only by cloneGroup
 * @param {Object} test
 * @param {Object} [options] - e.g. { groupId: "" }
 * @returns {Function}
 */
actions.transferTest = ( test, options = {}) => async ( dispatch, getState ) => {
  try {
    const groups = getState().suite.groups,
          source = groups[ test.groupId ].tests[ test.id ],
          id = uniqid(),
          merged = { ...source, ...options };

    dispatch( actions.addTest( merged, id ) );

    Object.values( source.commands ).forEach( command => {
      dispatch( actions.addCommand({ ...command, testId: id, groupId: options.groupId }) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot transfer test" );
  }

};


/**
 * Clone command within the same root
 * @param {Object} group
 * @returns {Function}
 */
actions.cloneGroup = ( group ) => async ( dispatch, getState ) => {
  try {
    const suite = getState().suite,
          source = suite.groups[ group.id ],
          id = uniqid(),
          merged = { ...source, id, key: id },
          position = { after: group.id };

    dispatch( actions.insertAdjacentGroup( merged, position, id ) );
    Object.values( source.tests ).forEach( test => {
      dispatch( actions.transferTest( test, { groupId: id }) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone group" );
  }

};

/**
 *
 * @param {Object} group
 * @returns {Function}
 */
actions.cloneTarget = ( target ) => async ( dispatch, getState ) => {
  try {
    const suite = getState().suite,
          source = suite.targets[ target.id ],
          id = uniqid(),
          merged = { ...source, id, key: id },
          position = { after: target.id };

    dispatch( actions.insertAdjacentTarget( merged, position, id ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone target" );
  }

};

actions.checkRuntimeTestDirReady = () => async ( dispatch ) => {
  try {
    const readyToRunTests = await isRuntimeTestPathReady();
    if ( !readyToRunTests ) {
      removeRuntimeTestPath();
    }
    return dispatch( actions.updateApp({ readyToRunTests }) );
  } catch ( ex ) {
    console.error( ex );
  }

};

export const saveGit = debounce( async ( store, isTouch = false ) => {
  if ( !store.settings.projectDirectory ) {
    return;
  }
  const ts = isTouch ? {} : { savedAt: dateToTs() };
  await writeGit( store.settings.projectDirectory,  {
    ...store.git,
    puppetry: version,
    ...ts,
    modified: false
  });

}, 100 );

export const saveProject = debounce( async ( store, isTouch = false ) => {

  if ( !store.settings.projectDirectory ) {
    return;
  }
  const ts = isTouch ? {} : { savedAt: dateToTs() };
  await writeProject( store.settings.projectDirectory,  {
    ...store.project,
    puppetry: version,
    ...ts,
    modified: false
  });

}, 100 );

actions.copyProjectTo = ( targetDirectory ) => async ( dispatch, getState ) => {
  try {
    const store = getState(),
          sourceDirectory = store.settings.projectDirectory;
    if ( !sourceDirectory ) {
      return;
    }
    copyProject( sourceDirectory, targetDirectory );
    await dispatch( actions.saveSettings({ projectDirectory: targetDirectory }) );
    await dispatch( actions.loadProject() );
  } catch ( ex ) {
    handleException( ex, dispatch, `Cannot copy to ${ targetDirectory }` );
  }

};

actions.createSuiteByRecording = ({ targets, commands }) => ( dispatch ) => {
  const groupId = uniqid(),
        testId = uniqid();

  dispatch( actions.updateApp({ loading: true }) );
  setTimeout( () => {
    try {
      // Seed targets
      Object.entries( targets ).forEach( ([ target, selector ]) => {
        dispatch( actions.addTarget({ target, selector }) );
      });
      dispatch( actions.addGroup({ title: "Recorded group" }, groupId ) );
      dispatch( actions.addTest({ title: "Recorded test", groupId }, testId ) );
      // Seed commands
      commands.forEach( ({ method, target, params }) => {

        dispatch( actions.addCommand({
          target,
          method,
          params,
          groupId,
          testId
        }) );
      });

      dispatch( actions.updateApp({ loading: false }) );
    } catch ( ex ) {
      handleException( ex, dispatch, "Cannot create suite by recording" );
    }

  }, 100 );


};


function noop() {
}

function handleException( ex, dispatch, title = null ) {
  console.error( ex );
  dispatch( actions.setError({
    visible: true,
    message: title || "Internal error",
    description: ex.message
  }) );
}

export default actions;