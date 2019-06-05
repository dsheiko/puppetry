import { handleActions } from "redux-actions";
import actions from "action";
import DEFAULT_STATE from "./defaultState";
import update from "immutability-helper";

export default handleActions(
  {

   [ actions.setSnippets ]: ( state, { payload }) => update( state, {
      modified: {
        $set: true
      },
      $merge: payload
    }),

    [ actions.resetSnippets ]: ( state, { payload }) => update( state, {
      $set: payload
    })

  },
  DEFAULT_STATE.snippets
);


