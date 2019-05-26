import settingsActions from "./settings";
import appActions from "./app";
import gitActions from "./git";
import projectActions from "./project";
import suiteActions from "./suite";
import targetActions from "./target";
import groupActions from "./group";
import testActions from "./test";
import commandActions from "./command";

const actions = {
  ...settingsActions,
  ...appActions,
  ...gitActions,
  ...projectActions,
  ...suiteActions,
  ...targetActions,
  ...groupActions,
  ...testActions,
  ...commandActions
};

export default actions;