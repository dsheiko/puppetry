export const PROJECT_OPTIONS = {
 name: "string#",
  // consider the structure: [Suite panel]-> [Targets pane][Groups pane]...
  appPanels: {
    suite: {
      panes: "array#"
    },
    settings: {
      panes: "array#"
    }
  },
  groups: "object#",
  savedAt: "number#",
  modified: "boolean#",
  lastOpenSuite: "string#"
};