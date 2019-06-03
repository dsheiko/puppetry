import { handleActions } from "redux-actions";
import actions from "action";
import DEFAULT_STATE from "./defaultState";
import update from "immutability-helper";
import stest from "./snippet/stest";
import scommand from "./snippet/scommand";

export default handleActions(
  {
    ...stest,
    ...scommand
  },
  DEFAULT_STATE.snippets
);


