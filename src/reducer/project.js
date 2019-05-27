import { handleActions } from "redux-actions";
import actions from "../action";
import DEFAULT_STATE from "./defaultState";
import update from "immutability-helper";

export default handleActions(
  {
    // Update after saving
    [ actions.setProject ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
          $merge: payload
        });
    },

    [ actions.updateProjectPanes ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
          appPanels: {
            [ payload.panel ]: {
              panes: {
                $set: payload.panes
              }
            }
          }
        });
    }
  },
  DEFAULT_STATE.project
);