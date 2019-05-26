import log from "electron-log";
import { createActions } from "redux-actions";
import { handleException, saveProject } from "./helpers";
import debounce from "lodash.debounce";
import { InvalidArgumentError } from "error";

import errorActions from "./error";
import {
  getProjectFiles,
  readProject,
  copyProject,
  isGitInitialized  } from "../service/io";
import { ipcRenderer } from "electron";
import { E_FILE_NAVIGATOR_UPDATED, E_WATCH_FILE_NAVIGATOR,
  E_PROJECT_LOADED, E_SUITE_LIST_UPDATED } from "constant";
import settingsActions from "./settings";
import appActions from "./app";
import gitActions from "./git";
import suiteActions from "./suite";

const actions = createActions({
  SET_PROJECT: ( options ) => options,

  UPDATE_PROJECT_PANES: ( panel, panes ) => ({ panel, panes })
});

// PROJECT

actions.loadProject = ( directory = null ) => async ( dispatch, getState ) => {
  const projectDirectory = directory || getState().settings.projectDirectory;
  let project;
  if ( !projectDirectory ) {
    throw new InvalidArgumentError( "Empty project directory" );
  }
  try {
    dispatch( appActions.updateApp({ loading: true }) );
    project = await readProject( projectDirectory );
    ipcRenderer.send( E_PROJECT_LOADED, projectDirectory );

    directory && dispatch( settingsActions.saveSettings({ projectDirectory }) );
    dispatch( actions.setProject( project ) );
    dispatch( gitActions.loadGit( projectDirectory ) );
    dispatch( actions.loadProjectFiles( projectDirectory ) );
    dispatch( actions.watchProjectFiles( projectDirectory ) );

    // keep track of recent projects
    dispatch( settingsActions.addSettingsProject({
      dir: projectDirectory,
      name: project.name
    }) );
    dispatch( settingsActions.saveSettings() );

    dispatch( gitActions.setGit({ initialized: isGitInitialized( projectDirectory ) }) );

    project.lastOpenSuite && dispatch( await suiteActions.openSuiteFile( project.lastOpenSuite ) );
  } catch ( err ) {
    log.warn( `Renderer process: actions.loadProject(${projectDirectory }): ${ err }` );
  } finally {
    dispatch( appActions.updateApp({ loading: false }) );
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
    dispatch( appActions.updateApp({ project: { files }}) );
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
    await dispatch( appActions.removeAppTab( "suite" ) );

  } catch ( e ) {
    dispatch( errorActions.setError({
      visible: true,
      message: "Cannot save project",
      description: e.message
    }) );
  }
};


actions.copyProjectTo = ( targetDirectory ) => async ( dispatch, getState ) => {
  try {
    const store = getState(),
          sourceDirectory = store.settings.projectDirectory;
    if ( !sourceDirectory ) {
      return;
    }
    copyProject( sourceDirectory, targetDirectory );
    await dispatch( settingsActions.saveSettings({ projectDirectory: targetDirectory }) );
    await dispatch( actions.loadProject() );
  } catch ( ex ) {
    handleException( ex, dispatch, `Cannot copy to ${ targetDirectory }` );
  }

};


export default actions;