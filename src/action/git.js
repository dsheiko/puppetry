import { createActions } from "redux-actions";
import { ipcRenderer } from "electron";
import {
  E_GIT_CURRENT_BRANCH, E_GIT_CURRENT_BRANCH_RESPONSE, E_CHECKOUT_MASTER_OPEN } from "constant";
import { version, handleException } from "./helpers";
import debounce from "lodash.debounce";
import mediator from "service/mediator";
import { dateToTs } from "service/utils";
import {
  writeGit,
  readGit } from "../service/io";
import appActions from "./app";

const actions = createActions({
  SET_GIT: ( options ) => options
});

// GIT

actions.saveGit = ( options ) => async ( dispatch, getState ) => {
  try {
    await dispatch( actions.setGit( options ) );
    const store = getState();
    await saveGit( store );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot save Git" );
  }

};

actions.loadGit = ( directory = null ) => async ( dispatch, getState ) => {
  const projectDirectory = directory || getState().settings.projectDirectory,
        lastSaveGitCfg = localStorage.getItem( "git" );
  // Backup git config for non open project
  if ( lastSaveGitCfg ) {
    dispatch( actions.setGit( JSON.parse( lastSaveGitCfg ) ) );
  }
  if ( !directory ) {
    return;
  }
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
      dispatch( appActions.setApp({ gitDetachedHeadState: true }) );
      mediator.emit( E_CHECKOUT_MASTER_OPEN, branch );
    }
  });
  ipcRenderer.send( E_GIT_CURRENT_BRANCH, projectDirectory );
};


export const saveGit = debounce( async ( store, isTouch = false ) => {
  const ts = isTouch ? {} : { savedAt: dateToTs() },
        data = {
          ...store.git,
          puppetry: version,
          ...ts,
          modified: false
        };

  localStorage.setItem( "git", JSON.stringify( data ) );
  if ( !store.settings.projectDirectory ) {
    return;
  }
  await writeGit( store.settings.projectDirectory, data );

}, 100 );

export default actions;