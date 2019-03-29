const DEFAULT_STATE = {
  // Settings stored in localStorage
  settings: {
    projectDirectory: "",
    exportDirectory: "",
    lastCheckedVersion: "",
    checkDate: ""
  },
  // Runtime state
  app: {
    greeting: "Hello!",
    loading: false,
    readyToRunTests: false,
    alert: {
      visible: false,
      title: "Error",
      type: "error",
      message: "",
      description: ""
    },
    selectedFile: "",
    confirmSaveChangesFile: "",

    editTargetsAsCsvModal: false,
    newProjectModal: false,
    openProjectModal: false,
    saveSuiteAsModal: false,
    newSuiteModal: false,
    openSuiteModal: false,
    exportProjectModal: false,
    testReportModal: false,
    installRuntimeTestModal: false,

    commandModal: {
      isVisible: false,
      record: null,
      targets: {},
      commands: {}
    },

    tabs: {
      available: {
        suite: false,
        testReport: false
      },
      active: "suite"
    },

    checkedList: [],
    headless: true,

    // Dynamic info coming not from project file, but from file watcher
    project: {
      files: []
    }
  },
  // Project data stored in file
  project: {
    name: "",
    panels: [],
    groups: {},
    modified: false,
    lastOpenSuite: ""
  },
  // actual (Selected) suite
  suite: {
    title: null,
    timeout: 50000,
    savedAt: null,
    loadedAt: null,
    modified: false,
    filename: "",
    targets: {},
    groups: {}
  }
};

export default DEFAULT_STATE;