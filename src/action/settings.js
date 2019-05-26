import { createActions } from "redux-actions";
import { handleException } from "./helpers";
import { getDateString, checkNewVersion } from "../service/http";

const STORAGE_KEY_SETTINGS = "settings",

      actions = createActions({
        SET_SETTINGS: ( options ) => options,

        ADD_SETTINGS_PROJECT: ( options ) => options,

        REMOVE_SETTINGS_PROJECT: ( options ) => options
      });

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

export default actions;