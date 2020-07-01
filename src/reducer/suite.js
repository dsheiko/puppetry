import { handleActions } from "redux-actions";
import actions from "action";
import DEFAULT_STATE from "./defaultState";
import update from "immutability-helper";
import group from "./suite/group";

import targetFn from "./suite/target";
import testFn from "./suite/test";
import commandFn from "./suite/command";

const command = commandFn( "Command" ),
      test = testFn( "Test" ),
      target = targetFn( "Target" );

export default handleActions(
  {

    [ actions.setSuite ]: ( state, { payload }) => update( state, {
      modified: {
        $set: true
      },
      $merge: payload
    }),

    [ actions.resetSuite ]: ( state, { payload = {}}) => {
      return Object.keys( payload ).length
        ? update( state, { $set: payload })
        : update( state, { $set: DEFAULT_STATE.suite });
    },

    ...target,
    ...group,
    ...test,
    ...command
  },
  DEFAULT_STATE.suite
);


