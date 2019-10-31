export default {
  // Settings stored in localStorage
  settings: {
    projectDirectory: "",
    projects: {}, // { dir, name }
    exportDirectory: "",
    lastCheckedVersion: "",
    checkDate: "",
    autosave: true,
    testCaseStyle: "gherkin"
  },
  // Runtime state
  app: {
    greeting: "Hello!",
    loading: false,

    readyToRunTests: false,

    // currently selected env
    environment: "",

    alert: {
      visible: false,
      title: "Error",
      type: "error",
      message: "",
      description: ""
    },
    selectedFile: "",
    confirmSaveChangesFile: "",

    gitLogs: [],
    gitDetachedHeadState: false,

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
    editProjectModal: false,
    gitCommitModal: false,
    gitSyncModal: false,
    gitCheckoutModal: false,
    gitCloneModal: false,
    editEnvironmentsModal: false,
    appLightbox: false,

    lightbox: {
      index: 0,
      images: []
    },

    commandModal: {
      isVisible: false,
      record: null,
      targets: {},
      commands: {}
    },

    snippetModal: {
      isVisible: false,
      record: null
    },

    tabs: {
      available: {
        suite: false,
        testReport: false,
        projectVariables: false,
        projectGit: false,
        projectTargets: false,
        settings: false
      },
      active: "suite"
    },

    checkedList: [],
    headless: true,
    incognito: true,
    ignoreHTTPSErrors: false,
    launcherArgs: "",
    updateSnapshot: false,
    interactiveMode: false,

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
    // state of data-tables
    groups: {},
    savedAt: 0,
    modified: false,
    lastOpenSuite: "",

    variables: {},
    targets: {},
    environments: [ "test", "stage", "production" ]
  },
  // actual (Selected) suite
  suite: {
    title: null,
    timeout: 50000,
    snippets: false,
    description: null,
    savedAt: null,
    loadedAt: null,
    modified: false,
    filename: "",
    targets: {},
    groups: {}
  },

  git: {
    initialized: false,
    commitedAt: 0,
    hasRemote: false,
    remoteRepository: "",
    configUsername: "",
    configEmail: "",
    credentialsAuthMethod: "",
    credentialsAccessToken: "",
    credentialsProvider: "",
    credentialsUsername: "",
    credentialsPassword: ""
  },

  snippets: {}
};

export const groupDefaultState = ( id ) => ({
  editing: false,
  id,
  key: id,
  title: "",
  tests: {},
  disabled: false,
  expanded: false,
  adding: false
});

export const testDefaultState = ( id ) => ({
  editing: false,
  id,
  key: id,
  title: "",
  commands: {},
  disabled: false,
  expanded: false,
  adding: false
});

export const commandDefaultState = ( id ) => ({
  editing: false,
  id,
  key: id,
  target: "",
  method: "",
  assert: {},
  params: {},
  disabled: false,
  failure: "",
  variables: {},
  expanded: false,
  refName: "",
  ref: "", // keeps the extrnal reference e.g. to a snippet
  isRef: false // indicates it's a ref (when new record created ref is empty and that's the only way to know)
});

export const targetDefaultState = ( id ) => ({
  editing: false,
  id,
  key: id,
  target: "",
  selector: "",
  disabled: false,
  adding: false,
  parentType: "",
  ref: ""
});

export const variableDefaultState = ( id ) => ({
  editing: false,
  id,
  key: id,
  name: "",
  value: "",
  env: "",
  disabled: false,
  adding: false,
  hidden: false
});