import { combineReducers } from "redux";

import settings from "./settings";
import app from "./app";
import project from "./project";
import suite from "./suite";
import snippets from "./snippets";

export default combineReducers({
  settings,
  app,
  project,
  suite,
  snippets
});
