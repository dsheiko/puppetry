import { handleActions } from "redux-actions";
import actions from "../action";
import DEFAULT_STATE from "./defaultState";
import update from "immutability-helper";
import { sortStrings } from "service/utils";

export default handleActions(
  {
    [ actions.setSettings ]: ( state, { payload }) => {
      return update( state, {
          $set: payload
      });
    },

    [ actions.addSettingsProject ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }

      //sort
      const projects = !Object.keys( state.projects ).length
        ? { [ payload.dir ]: payload.name }
        : Object.entries( update( state.projects, {
          $merge: { [ payload.dir ]: payload.name }
        }) )
          .sort( ( a, b ) => sortStrings( a[ 1 ], b[ 1 ]) )
          .reduce( ( carry, [ key, value ]) => {
            carry[ key ] = value;
            return carry;
          }, {});

      return update( state, {
        projects: {
          $set: projects
        }
      });
    },

    [ actions.removeSettingsProject ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        projects: {
          $unset: [ payload ]
        }
      });
    }

  },
  DEFAULT_STATE.settings
);