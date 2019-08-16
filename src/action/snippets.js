import { createActions } from "redux-actions";
import { readSuite } from "../service/io";
import { SNIPPETS_FILENAME } from "constant";
import DEFAULT_STATE from "reducer/defaultState";

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

export default actions;