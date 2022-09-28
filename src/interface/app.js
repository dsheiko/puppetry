export const ERROR_OPTIONS = {
  visible: "boolean",
  message: "string",
  description: "string="
};

export const APP_COMMAND_MODAL_OPTIONS = {
  isVisible: "boolean=",
  record: "object=",
  targets: "object=",
  commands: "object="
};


export const APP_OPTIONS = {
  greeting: "string=",
  loading: "boolean=",
  readyToRunTests: "boolean=",
  alert: "object=",
  selectedFile: "string=",
  confirmSaveChangesFile: "string=",
  editTargetsAsCsvModal: "boolean=",
  newProjectModal: "boolean=",
  saveProjectAsModal: "boolean=",
  openProjectModal: "boolean=",
  saveSuiteAsModal: "boolean=",
  newSuiteModal: "boolean=",
  openSuiteModal: "boolean=",
  exportProjectModal: "boolean=",
  testReportModal: "boolean=",
  installRuntimeTestModal: "boolean=",
  editProjectModal: "boolean=",
  commandModal: "object=",
  tabs: "object=",
  checkedList: "array=",
  headless: "boolean=",
  launcherArgs: "string=",
  // Dynamic info coming not from project file, but from file watcher
  project: "object="
};