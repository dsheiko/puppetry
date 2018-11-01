import { createActions } from "redux-actions";
import { validate, validatePlain } from "../service/validate";
import { writeSuite, readSuite, removeSuite,
  getProjectFiles, writeProject,
  readProject, removeRuntimeTemp,
  normalizeFilename } from "../service/io";
import { closeApp } from "service/utils";
import { InvalidArgumentError } from "error";
import DEFAULT_STATE from "reducer/defaultState";
import { ipcRenderer } from "electron";
import { E_PROJECT_LOADED, E_SUITE_LOADED } from "constant";
import { remote } from "electron";

const STORAGE_KEY_SETTINGS = "settings",

      version = remote ? remote.app.getVersion() : "0.1",

      actions = createActions({

        SET_SETTINGS: ( options ) => options,

        SET_ERROR: ( options ) => validate( "errorOptions", options ),

        /**
         * @param {object} options = { loading, newProjectModal, testReportModal, project }
         * @returns {object}
         */
        UPDATE_APP: ( options ) => validate( "updateAppOptions", options ),

        ADD_APP_TAB: ( tabKey ) => validatePlain( "appTabKey", tabKey ),

        REMOVE_APP_TAB: ( tabKey ) => validatePlain( "appTabKey", tabKey ),

        SET_APP_TAB: ( tabKey ) => tabKey,

        SET_PROJECT: ( options ) => options,

        SET_SUITE: ( options ) => validate( "updateSuiteOptions", options ),

        RESET_SUITE: ( options ) => validate( "updateSuiteOptions", options ),

        SWAP_TARGET: ( options ) => validate( "swapTargetOptions", options ),

        SWAP_COMMAND: ( options ) => validate( "swapCommandOptions", options ),

        SWAP_TEST: ( options ) => validate( "swapTestOptions", options ),

        SWAP_GROUP: ( options ) => validate( "swapGroupOptions", options ),

        /**
         * @param {object} options = { title, editing }
         * @returns {object}
         */
        UPDATE_SUITE: ( options ) => validate( "updateSuiteOptions", options ),
        /**
         * @param {object} options = { target, selector, editing }
         * @returns {object}
         */
        ADD_TARGET: ( options ) => validate( "addTargetOptions", options ),
        /**
         * @param {object} options = { id, target, selector, editing }
         * @returns {object}
         */
        UPDATE_TARGET: ( options ) => validate( "updateTargetOptions", options ),
        /**
         * @param {object} options = { id }
         * @returns {object}
         */
        REMOVE_TARGET: ( options ) => validate( "removeOptions", options ),
        /**
         * @param {object} options = { title, editing }
         * @returns {object}
         */
        ADD_GROUP: ( options ) => validate( "addGroupOptions", options ),
        /**
         * @param {object} options = { id, title, editing }
         * @returns {object}
         */
        UPDATE_GROUP: ( options ) => validate( "updateGroupOptions", options ),
        /**
         * @param {object} options = { id }
         * @returns {object}
         */
        REMOVE_GROUP: ( options ) => validate( "removeOptions", options ),
        /**
         * @param {object} options = { groupId, title, editing }
         * @returns {object}
         */
        ADD_TEST: ( options ) => validate( "addTestOptions", options ),
        /**
         * @param {object} options = { groupId, id, title, editing }
         * @returns {object}
         */
        UPDATE_TEST: ( options ) => validate( "updateTestOptions", options ),
        /**
         * @param {object} options = { groupId, id }
         * @returns {object}
         */
        REMOVE_TEST: ( options ) => validate( "removeTestOptions", options ),
        /**
         * @param {object} options = { testId, groupId, target, method, editing }
         * @returns {object}
         */
        ADD_COMMAND: ( options ) => validate( "addCommandOptions", options ),
        /**
         * @param {object} options = { testId, groupId, id, target, method, editing }
         * @returns {object}
         */
        UPDATE_COMMAND: ( options ) => validate( "updateCommandOptions", options ),
        /**
         * @param {object} options = { testId, groupId, id }
         * @returns {object}
         */
        REMOVE_COMMAND: ( options ) => validate( "removeCommandOptions", options )
      });

/**
 * Thunk actions
 */

actions.saveSettings = ( payload ) => ( dispatch, getState ) => {
  const settings = { ...getState().settings, ...payload };
  localStorage.setItem( STORAGE_KEY_SETTINGS, JSON.stringify( settings ) );
  dispatch( actions.setSettings( settings ) );
};

actions.loadSettings = () => ( dispatch, getState ) => {
  const saved = JSON.parse( localStorage.getItem( STORAGE_KEY_SETTINGS ) || "{}" ),
        settings = { ...getState().settings, ...saved };
  dispatch( actions.setSettings( settings ) );
  return settings;
};


actions.loadProject = ( directory = null ) => async ( dispatch, getState ) => {
  const projectDirectory = directory || getState().settings.projectDirectory;
  if ( !projectDirectory ) {
    throw new InvalidArgumentError( "Empty project directory" );
  }
  const project = await readProject( projectDirectory );
  ipcRenderer.send( E_PROJECT_LOADED, projectDirectory );
  directory && dispatch( actions.saveSettings({ projectDirectory }) );
  dispatch( actions.setProject( project ) );
  try {
    project.lastOpenSuite && dispatch( await actions.openSuiteFile( project.lastOpenSuite ) );
  } catch ( err ) {
    dispatch( actions.setError({
      visible: true,
      message: "Cannot open file",
      description: err.message
    }) );
  }
  return project;
};


actions.removeSuite = ( filename ) => async ( dispatch, getState ) => {
  if ( !filename || typeof filename !== "string" ) {
    throw new InvalidArgumentError( "Filename is not a string or empty" );
  }
  const { projectDirectory } = getState().settings;
  removeSuite( projectDirectory, filename );
};


actions.createSuite = ( rawFilename, title ) => async ( dispatch, getState ) => {
  if ( !rawFilename || typeof rawFilename !== "string" ) {
    throw new InvalidArgumentError( "Filename is not a string or empty" );
  }
  if ( !title || typeof title !== "string" ) {
    throw new InvalidArgumentError( "Title is not a string or empty" );
  }
  const { projectDirectory } = getState().settings,
        filename = normalizeFilename( rawFilename ) + ".json",
        suite = { ...DEFAULT_STATE.suite, filename, title, savedAt: new Date() };
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

    dispatch( actions.updateSuite({ savedAt: new Date() }) );
    dispatch( actions.updateApp({ closeAppModal: false }) );
  } catch ( e ) {
    dispatch( actions.setError({
      visible: true,
      message: "Internal Error",
      description: e.message
    }) );
  }
};

actions.loadSuite = ( filename ) => async ( dispatch, getState ) => {
  const { projectDirectory } = getState().settings,
        suite = await readSuite( projectDirectory, filename );
  dispatch( actions.setProject({ lastOpenSuite: filename }) );
  dispatch( actions.resetSuite({ ...suite, loadedAt: new Date(), filename, modified: false }) );
  ipcRenderer.send( E_SUITE_LOADED, projectDirectory, filename );
  dispatch( actions.addAppTab( "suite" ) );
};

actions.loadProjectFiles = () => async ( dispatch, getState ) => {
  const { projectDirectory } = getState().settings,
        files = await getProjectFiles( projectDirectory );
  dispatch( actions.updateApp({ project: { files }}) );
};

actions.setLoadingFor = ( ms ) => async ( dispatch ) => {
  dispatch( actions.updateApp({ loading: true }) );
  setTimeout( () => {
    dispatch( actions.updateApp({ loading: false }) );
  }, ms );
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
    console.warn( e );
  }
  dispatch( actions.updateApp({ loading: false }) );
};

actions.closeApp = () => async ( dispatch, getState ) => {
  const store = getState(),
        { modified } = store.suite.modified;

  await saveProject( store );

  if ( modified ) {
    return dispatch( actions.updateApp({ closeAppModal: true }) );
  }
  removeRuntimeTemp();
  closeApp();
};

async function saveProject( store ) {
  if ( !store.settings.projectDirectory ) {
    return;
  }
  await writeProject( store.settings.projectDirectory,  {
    ...store.project,
    puppetry: version,
    modified: false
  });
}

export default actions;