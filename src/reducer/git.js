import { handleActions } from "redux-actions";
import actions from "../action";
import DEFAULT_STATE from "./defaultState";
import update from "immutability-helper";

export default handleActions(
  {

    [ actions.resetGit ]: ( state ) => {
      return update( state, {
        $set: DEFAULT_STATE.git
      });
    },

    [ actions.setGit ]: ( state, { payload }) => {
      return update( state, {
        $merge: payload
      });
    }

  },
  DEFAULT_STATE.git
);