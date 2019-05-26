import log from "electron-log";
import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { version, handleException, saveProject } from "./helpers";
import uniqid from "uniqid";
import DEFAULT_STATE from "reducer/defaultState";
import { InvalidArgumentError } from "error";
import { dateToTs } from "service/utils";
import errorActions from "./error";
import { writeSuite, readSuite, removeSuite, normalizeFilename } from "../service/io";
import { ipcRenderer } from "electron";
import {  E_SUITE_LOADED } from "constant";
import projectActions from "./project";
import appActions from "./app";
import targetActions from "./target";
import groupActions from "./group";
import testActions from "./test";
import commandActions from "./command";

const actions = createActions({
  SET_SUITE: ( options ) => validate( options, I.UPDATE_SUITE_OPTIONS ),

  RESET_SUITE: ( options ) => validate( options, I.UPDATE_SUITE_OPTIONS ),

  /**
    * @param {object} options = { title, editing }
    * @returns {object}
    */
  UPDATE_SUITE: ( options ) => validate( options, I.UPDATE_SUITE_OPTIONS )

});

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

actions.loadSuite = ( filename ) => async ( dispatch, getState ) => {
  try {
    const store = getState(),
          { projectDirectory } = store.settings,
          suite = await readSuite( projectDirectory, filename );
    dispatch( projectActions.setProject({ lastOpenSuite: filename }) );
    dispatch( actions.resetSuite({ ...suite, loadedAt: dateToTs(), filename, modified: false }) );
    ipcRenderer.send( E_SUITE_LOADED, projectDirectory, filename, store.app.project.files );
    dispatch( appActions.addAppTab( "suite" ) );
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
    dispatch( errorActions.setError({
      visible: true,
      message: "Internal Error",
      description: e.message
    }) );
  }
};

actions.openSuiteFile = ( filename ) => ( dispatch ) => {
  dispatch( appActions.updateApp({ loading: true }) );
  try {
    dispatch( actions.loadSuite( filename ) );
  } catch ( e ) {
    dispatch( errorActions.setError({
      visible: true,
      message: "Cannot open file",
      description: e.message
    }) );
    log.warn( `Renderer process: actions.openSuiteFile: ${ e }` );
  }
  dispatch( appActions.updateApp({ loading: false }) );
};


actions.createSuiteByRecording = ({ targets, commands }) => ( dispatch ) => {
  const groupId = uniqid(),
        testId = uniqid();

  dispatch( appActions.updateApp({ loading: true }) );
  setTimeout( () => {
    try {
      // Seed targets
      Object.entries( targets ).forEach( ([ target, selector ]) => {
        dispatch( targetActions.addTarget({ target, selector }) );
      });
      dispatch( groupActions.addGroup({ title: "Recorded group" }, groupId ) );
      dispatch( testActions.addTest({ title: "Recorded test", groupId }, testId ) );
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

      dispatch( appActions.updateApp({ loading: false }) );
    } catch ( ex ) {
      handleException( ex, dispatch, "Cannot create suite by recording" );
    }

  }, 100 );


};


export default actions;