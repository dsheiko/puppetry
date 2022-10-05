import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import log from "electron-log";
import { saveProject } from "./helpers";
import { closeApp } from "service/utils";
import { removeRuntimeTestPath,
  isRuntimeTestPathReady } from "../service/io";
import { getDateString, checkNewVersion } from "../service/http";
import settingsActions from "./settings";

const actions = createActions({
  /**
    * @param {object} options
    * @returns {object}
    */
  SET_APP: ( options ) => validate( options, I.APP_OPTIONS ),

  ADD_APP_TAB: ( tabKey ) => validate( tabKey, "string" ),

  REMOVE_APP_TAB: ( tabKey ) => validate( tabKey, "string" ),

  SET_APP_TAB: ( tabKey ) => validate( tabKey, "string" ),

  SET_LIGHTBOX_IMAGES: ( images ) => validate( images, "object[]" ),

  SET_LIGHTBOX_INDEX: ( index ) => validate( index, "number" ),

  CLEAN_LIGHTBOX: () => {}
});

// APP

actions.setLoadingFor = ( ms ) => async ( dispatch ) => {
  dispatch( actions.setApp({ loading: true }) );
  setTimeout( () => {
    dispatch( actions.setApp({ loading: false }) );
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
    return dispatch( settingsActions.saveSettings({ checkDate }, false ) );
  } catch ( ex ) {
    console.error( ex );
  }

};

actions.closeApp = () => async ( dispatch, getState ) => {
  const store = getState();
  try {
    await saveProject( store );
  } catch ( ex ) {
    log( "Cannot close app " + ex.message );
  }
  closeApp();
};


actions.checkRuntimeTestDirReady = () => async ( dispatch ) => {
  try {
    const readyToRunTests = await isRuntimeTestPathReady();
    if ( !readyToRunTests ) {
      removeRuntimeTestPath();
    }
    return dispatch( actions.setApp({ readyToRunTests }) );
  } catch ( ex ) {
    console.error( ex );
  }

};

export default actions;