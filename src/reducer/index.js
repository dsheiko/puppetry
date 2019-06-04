import { combineReducers } from "redux";

import settings from "./settings";
import app from "./app";
import git from "./git";
import project from "./project";
import suite from "./suite";

export default combineReducers({
  settings,
  app,
  git,
  project,
  suite
});
