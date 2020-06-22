import { createActions } from "redux-actions";
import { readSuite, writeSuite } from "../service/io";
import { SNIPPETS_FILENAME } from "constant";
import DEFAULT_STATE from "reducer/defaultState";
import { dateToTs } from "service/utils";
import { version, handleException, saveProject } from "./helpers";
import { message } from "antd";
import errorActions from "./error";

let autosaveTimeout;

const actions = createActions({
  SET_SNIPPETS: ( options ) => options,
  RESET_SNIPPETS: ( options ) => options
});


actions.loadSnippets = () => async ( dispatch, getState ) => {
  try {
    const store = getState(),
          { projectDirectory } = store.settings,
          data = await readSuite( projectDirectory, SNIPPETS_FILENAME ),
          // in case of snippets
          suite = data === null
            ? { ...DEFAULT_STATE.suite, filename: SNIPPETS_FILENAME }
            : data;

    suite.snippets = true;
    dispatch( actions.resetSnippets({
      targets: suite.targets,
      groups: suite.groups
    }) );
  } catch ( ex ) {
    // That's fine, older project do not have this file
    // handleException( ex, dispatch, `Cannot load snippets` );
  }

};

actions.saveSnippets = ( options = {}, autosave = false ) => async ( dispatch, getState ) => {
  const store = getState(),
        { projectDirectory } = store.settings,
        filename = SNIPPETS_FILENAME;

  clearTimeout( autosaveTimeout );

  try {
    if ( !projectDirectory ) {
      throw new InvalidArgumentError( "Empty project directory" );
    }
    const data = { ...store.snippets, puppetry: version };
    console.log( projectDirectory, filename, JSON.stringify( data, null, "  " ) );
    await writeSuite( projectDirectory, filename, JSON.stringify( data, null, "  " ) );

    if ( !autosave ) {
      dispatch( actions.setSnippets({ savedAt: dateToTs(), modified: false }) );
    }

  } catch ( e ) {
    dispatch( errorActions.setError({
      visible: true,
      message: "Internal Error",
      description: e.message
    }) );
  }
};

actions.autosaveSnippets = () => ( dispatch, getState ) => {

  const store = getState(),
        autosaveSnippets = () => {
          autosaveTimeout = null;
          dispatch( actions.setSnippets({ savedAt: dateToTs(), modified: false }) );
          dispatch( actions.saveSnippets({}, true ) );
          saveProject( store );
          message.destroy();
          message.info( `Data saved!` );
        };
        console.log("?", store.settings.autosave,store.settings.projectDirectory);
  if ( ( store.settings.autosave ?? true ) && store.settings.projectDirectory ) {
    clearTimeout( autosaveTimeout );
    autosaveTimeout = setTimeout( autosaveSnippets, 1500 );
  }

};

export default actions;