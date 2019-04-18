const DEFAULT_STATE = {
  // Settings stored in localStorage
  settings: {
    projectDirectory: "",
    exportDirectory: "",
    lastCheckedVersion: "",
    checkDate: "",
    git: {
      ready: false,
      repository: "",
      configUsername: "",
      configEmail: "",
      credentialsUsername: "",
      credentialsPassword: ""
    }
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
    saveProjectAsModal: false,
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
        testReport: false,
        settings: false
      },
      active: "suite"
    },

    checkedList: [],
    headless: true,
    launcherArgs: "",

    // Dynamic info coming not from project file, but from file watcher
    project: {
      files: []
    }
  },
  // Project data stored in file
  project: {
    name: "",

    // consider the structure: [Suite panel]-> [Targets pane][Groups pane]...
    appPanels: {
      suite: {
        panes: []
      },
      settings: {
        panes: []
      }
    },

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


export const groupDefaultState = ( id ) => ({
  editing: false,
  id,
  key: id,
  title: "",
  tests: {},
  disabled: false
});

export const testDefaultState = ( id ) => ({
  editing: false,
  id,
  key: id,
  title: "",
  commands: {},
  disabled: false
});

export const commandDefaultState = ( id ) => ({
  editing: false,
  id,
  key: id,
  target: "",
  method: "",
  assert: "",
  params: {},
  disabled: false,
  failure: ""
});

export const targetDefaultState = ( id ) => ({
  editing: false,
  id,
  key: id,
  target: "",
  selector: "",
  disabled: false,
  adding: false
});