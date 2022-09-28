import { SNIPPETS_GROUP_ID } from "constant";

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
    bootstrapLoaded: false,
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
  
    editEnvironmentsModal: false,
    appLightbox: false,

    newSnippetModal: false,
    saveSnippetAsModal: false,
    editSnippetModal: false,
    // togather with newSnippetModal, saveSnippetAsModal
    snippetModal: { title: null, id: null },


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
    // Application tabs
    tabs: {
      available: {
        suite: false,
        testReport: false,
        projectVariables: false,
        projectTargets: false,
        settings: false,
        snippet: false
      },
      active: "suite"
    },

    checkedList: [],

    passSuiteOptions: {},
    passExportOptions: {},
    passProjectOptions: {
      headless: true,
      incognito: true,
      ignoreHTTPSErrors: false
    },

    // Dynamic info coming not from project file, but from file watcher
    project: {
      files: []
    }
  },
  // Project data stored in file
  project: {
    name: "",

    lastOpenSnippetId: null,

    // consider the structure: [Suite panel]-> [Targets pane][Groups pane]...
    appPanels: {
      suite: {
        panes: []
      },
      settings: {
        panes: []
      },
      snippet: {
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
    groups: {},
    pages: {}
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

  snippets: {

    groups: {
      [ SNIPPETS_GROUP_ID ]: {
        tests: {}
      }
    }
  }
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
  page: "",
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

export const pageDefaultState = ( id ) => ({
  editing: false,
  id,
  key: id,
  name: "",
  url: "",
  disabled: false,
  adding: false
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