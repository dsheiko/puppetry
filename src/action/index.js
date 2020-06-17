import settingsActions from "./settings";
import errorActions from "./error";
import appActions from "./app";
import gitActions from "./git";
import projectActions from "./project";
import suiteActions from "./suite";
import targetActions from "./target";
import sharedTargetActions from "./sharedTarget";
import groupActions from "./group";
import testActions from "./test";
import commandActions from "./command";
import snippetsActions from "./snippets";
import variableActions from "./variable";
import snippetsCommandActions from "./snippetsCommand";
import snippetsTestActions from "./snippetsTest";
import snippetsTargetActions from "./snippetsTarget";

const actions = {
  ...errorActions,
  ...settingsActions,
  ...appActions,
  ...gitActions,
  ...projectActions,
  ...suiteActions,
  ...targetActions,
  ...groupActions,
  ...testActions,
  ...commandActions,
  ...snippetsActions,
  ...variableActions,
  ...sharedTargetActions,
  ...snippetsCommandActions,
  ...snippetsTestActions,
  ...snippetsTargetActions
};

export default actions;