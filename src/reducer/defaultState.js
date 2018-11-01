const DEFAULT_STATE = {
  // Settings stored in localStorage
  settings: {
    projectDirectory: "",
    exportDirectory: ""
  },
  // Runtime state
  app: {
    loading: false,
    alert: {
      visible: false,
      title: "Error",
      type: "error",
      message: "",
      description: ""
    },
    selectedFile: "",
    newProjectModal: false,
    openProjectModal: false,
    saveSuiteAsModal: false,
    closeAppModal: false,
    newSuiteModal: false,
    openSuiteModal: false,
    confirmDeleteModal: false,
    exportProjectModal: false,
    testReportModal: false,

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
    projectDirectory: "",
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