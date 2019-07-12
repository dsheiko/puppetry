import { handleActions } from "redux-actions";
import actions from "../action";
import DEFAULT_STATE from "./defaultState";
import update from "immutability-helper";
import variable from "./project/variable";

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


    [ actions.resetProject ]: ( state, { payload } ) => {
      if ( !payload ) {
        return update( state, {
          $set: DEFAULT_STATE.project
        });
      }

      return update( DEFAULT_STATE.project, {
        $merge: payload
      });
    },


    [ actions.addEnv ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        environments: {
          $push: [ payload ]
        }
      });
    },

    [ actions.removeEnv ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        environments: arr => arr.filter( item => item !== payload )
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
    },

    ...variable
  },
  DEFAULT_STATE.project
);