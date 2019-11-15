exports.E_RESET_FORM = "resetFormEvent";
exports.E_RUN_REPORT = "runReport";
exports.E_BROWSE_DIRECTORY = "browseDirectory";
exports.E_DIRECTORY_SELECTED = "directorySelected";
exports.E_BROWSE_FILE = "openSuite";
exports.E_FILE_SELECTED = "suiteFile";
exports.E_RUN_TESTS = "runTests";
exports.E_TEST_REPORTED = "testReported";
exports.E_PROJECT_LOADED = "projectLoaded";
exports.E_SUITE_LOADED = "suiteLoaded";
exports.E_SUITE_LIST_UPDATED = "suiteListUpdated";
exports.E_MENU_NEW_PROJECT = "menuNewProject";
exports.E_MENU_NEW_SUITE = "menuNewSuite";
exports.E_MENU_OPEN_PROJECT = "menuOpenProject";
exports.E_MENU_SAVE_SUITE = "menuSaveSuite";
exports.E_MENU_SAVE_SUITE_AS = "menuSaveSuiteAs";
exports.E_MENU_OPEN_SUITE = "menuOpenSuite";
exports.E_MENU_EXPORT_PROJECT = "menuExportProject";
exports.E_MENU_EXIT_APP = "menuExitApp";
exports.E_MENU_RUN = "menuRun";
exports.E_INSTALL_RUNTIME_TEST = "installRuntimeTest";
exports.E_RUNTIME_TEST_PROGRESS = "runtimeTestProgress";
exports.E_RUNTIME_TEST_MILESTONE = "runtimeTestMilestone";
exports.E_RUNTIME_TEST_ERROR = "runtimeTestError";
exports.E_SHOW_CONFIRM_DIALOG = "showConfirmDialog";
exports.E_CONFIRM_DIALOG_VALUE = "confirmDialogValue";
exports.E_ENTITY_CREATED = "entityCreated";
exports.E_GIT_INIT = "gitInit";
exports.E_RENDERER_ERROR = "rendererError";
exports.E_RENDERER_INFO = "rendererInfo";
exports.E_GIT_COMMIT = "gitCommit";
exports.E_GIT_COMMIT_RESPONSE = "gitCommitResponse";
exports.E_GIT_SYNC = "gitPull";
exports.E_GIT_SYNC_RESPONSE = "gitPullResponse";
exports.E_GIT_PUSH = "gitPush";
exports.E_GIT_LOG = "gitLog";
exports.E_GIT_LOG_RESPONSE = "gitLogResponse";
exports.E_GIT_CLONE = "gitClone";
exports.E_GIT_CLONE_RESPONSE = "gitCloneResponse";
exports.E_GIT_CHECKOUT = "gitCheckout";
exports.E_GIT_CHECKOUT_RESPONSE = "gitCheckoutResponse";
exports.E_GIT_CHECKOUT_M = "gitCheckoutMaster";
exports.E_GIT_CHECKOUT_M_RESPONSE = "gitCheckoutMasterResponse";
exports.E_GIT_REVERT = "gitRevert";
exports.E_GIT_REVERT_RESPONSE = "gitRevertResponse";
exports.E_GIT_SET_REMOTE = "gitSetRemote";
exports.E_GIT_CURRENT_BRANCH = "gitCurrentBranch";
exports.E_GIT_CURRENT_BRANCH_RESPONSE = "gitCurrentBranchResponse";

exports.E_CHECKOUT_MASTER_OPEN = "checkoutMasterOpen";
exports.E_CHECKOUT_MASTER_CLOSE = "checkoutMasterClose";
exports.E_OPEN_RECORDER_WINDOW = "openRecorderWindow";
exports.E_RECEIVE_RECORDER_SESSION = "receiveRecorderSession";
exports.E_DELEGATE_RECORDER_SESSION = "delegateRecorderSession";

exports.E_FILE_NAVIGATOR_UPDATED = "fileNavigatorUpdated";
exports.E_WATCH_FILE_NAVIGATOR = "watchFileNavigator";

exports.A_FORM_ITEM_SUCCESS = "success";
exports.A_FORM_ITEM_WARNING = "warning";
exports.A_FORM_ITEM_ERROR = "error";
exports.A_FORM_ITEM_VALIDATING = "validating";

exports.RUNTIME_TEST_DIRECTORY = ".runtime-test";
exports.JEST_PKG_DIRECTORY = "jest-pkg";
exports.DEMO_PROJECT_DIRECTORY = "project-demo";
exports.PUPPETRY_LOCK_FILE = "puppetry-lock.json";

exports.TXT_PARAM_IS_REQUIRED = "Parameter is required";

exports.COMMAND_ID_COMMENT = "// @puppetry-command-id=";
exports.RUNNER_PUPPETRY = "RUNNER_PUPPETRY";
exports.RUNNER_JEST = "RUNNER_JEST";

exports.SNIPPETS_FILENAME = ".snippets.json";
exports.SNIPPETS_GROUP_ID = "snippets";

// screenshots/.trace for printable text
exports.DIR_SCREENSHOTS_TRACE = ".trace";
exports.DIR_SCREENSHOTS = "screenshots";
exports.DIR_SNAPSHOTS = "snapshots";
exports.DIR_REPORTS = "reports";

exports.INLINE_INPUT_STYLES = { width: 200 };

exports.SELECTOR_CHAIN_DELIMITER = ">>";

exports.SELECTOR_CSS = 1;
exports.SELECTOR_XPATH = 2;

exports.STORAGE_KEY_SETTINGS = "settings";

exports.FIELDSET_DEFAULT_LAYOUT = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

exports.FIELDSET_DEFAULT_CHECKBOX_LAYOUT = {
  wrapperCol: {
    span: 21,
    offset: 3
  }
};


exports.MODAL_DEFAULT_PROPS = {
  transitionName: "none",
  maskTransitionName: "none",
  forceRender: true,
  confirmLoading: false
};


exports.TIPS = [
  "To perform a bulk operation on multiple rows, <br /> select them with “Shift-click”.",
  "To perform a bulk operation on multiple rows, <br /> select them with “Shift-click”.",
  "To perform a bulk operation on multiple rows, <br /> select them with “Shift-click”.",
  "You can use drag & drop and context menu <br />when working with tables.",
  "Auto-saving can be disabled in “Settings”.",
  "You can change test case representation style in settings.",
  "You can export project as text specification. <br />Screenshots per action will be generated automatically.",
  "Did you know that you can make an in-app screenshot <br />with “Ctrl/CMD-Shift-4”?",
  "To find application working directory,<br /> click on “Edit” icon next to project name",
  "To run tests in browser, opt-in in <br />“Run Tests” / “Browser options”  tab.",
  "You can copy table rows in one project<br /> and paste them into another.",
  "If your test site has broken SSL certificate,<br /> tick on “ignore HTTPS errors” in “Browser options” tab.",
  "To follow testing steps one by one,<br /> tick on “interactive mode” on “Run Tests” modal.",
  "You can set BASE_URL values for dev/stage/live environments<br /> and refer the variable in the test cases",
  "Use snippets to reuse testing flows among test cases",
  "Use “page.assertConsoleMessage” to test console messages<br /> on the page under test",
  "You can accept/dismiss “window.prompt”<br /> with “page.closeDialog” action",
  "To run exported project in Firefox,<br /> call “npm run test:firefox”",
  "You can use “page.assertScreenshot” to compare page views<br /> before refactoring CSS and after",
  "You can use “page.debug” to pause test execution<br /> and inspect the page",
  "Did you know that you can navigate suite tabs with “Crtl-TAB”?",
  "Did you know that you can navigate suite tabs with “Crtl-TAB”?",
  "Use :not(:empty) selector to target a non-empty element",
  "Use a[href*='subsring'] selector to target a link<br /> whose href attribute contains 'subsring'"
];
