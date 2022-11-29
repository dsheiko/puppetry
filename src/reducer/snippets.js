import { handleActions } from "redux-actions";
import actions from "action";
import DEFAULT_STATE from "./defaultState";
import update from "immutability-helper";

import targetFn from "./suite/target";
import testFn from "./suite/test";
import commandFn from "./suite/command";
import pageFn from "./suite/page";

const command = commandFn( "SnippetsCommand" ),
      test = testFn( "SnippetsTest" ),
      target = targetFn( "SnippetsTarget" ),
      win = pageFn( "PageTarget" );

export default handleActions(
  {

    [ actions.setSnippets ]: ( state, { payload }) => update( state, {
      modified: {
        $set: true
      },
      $merge: payload
    }),

    [ actions.resetSnippets ]: ( state, { payload }) => update( state, {
      targets: {
        $set: payload.targets
      },
      tests: {
        $set: payload.tests
      }
    }),

    ...target,
    ...test,
    ...command,
    ...win

  },
  DEFAULT_STATE.snippets
);


