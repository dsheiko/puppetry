# Plan: Prevent unnecessary re-renders via direct Redux connections

## Context

The root cause of the re-render cascade is `AppLayout.jsx` mapping `store: state` — the entire Redux
state tree — which means AppLayout re-renders on every single state change (editing a test command,
toggling a modal, autosave tick, etc.). That re-render propagates to `TabGroup`, which passes full
state slices (`app`, `project`, `snippets`, `git`, `settings`) as props to its children. Those
children (`TestReport`, `SettingsPanel`, `GitPane`) have no `shouldComponentUpdate` guard and no
direct Redux connection, so they blindly re-render on every AppLayout tick.

The fix is to granularize `AppLayout`'s `mapStateToProps` and connect the three unconnected children
directly to Redux so they only re-render when the specific fields they use actually change.

---

## Change 1 — `src/component/AppLayout.jsx`

**Problem:** `mapStateToProps = (state) => ({ store: state, ... })` always returns a new object
reference, defeating the shallow-equality check in `connect()`.

**Fix:** Replace `store: state` with individual field selections. `connect()` will then short-circuit
re-renders when none of these specific values change (e.g. when `state.suite.tests` changes but no
modal visibility / loading flag changes).

New `mapStateToProps`:
```js
mapStateToProps = (state) => ({
  // app
  loading:                  state.app.loading,
  tabs:                     state.app.tabs,
  commandModal:             state.app.commandModal,
  snippetModal:             state.app.snippetModal,
  newProjectModal:          state.app.newProjectModal,
  openProjectModal:         state.app.openProjectModal,
  openSuiteModal:           state.app.openSuiteModal,
  saveSuiteAsModal:         state.app.saveSuiteAsModal,
  saveProjectAsModal:       state.app.saveProjectAsModal,
  newSuiteModal:            state.app.newSuiteModal,
  alert:                    state.app.alert,
  testReportModal:          state.app.testReportModal,
  exportProjectModal:       state.app.exportProjectModal,
  readyToRunTests:          state.app.readyToRunTests,
  gitDetachedHeadState:     state.app.gitDetachedHeadState,
  gitLogs:                  state.app.gitLogs,
  gitCommitModal:           state.app.gitCommitModal,
  gitSyncModal:             state.app.gitSyncModal,
  gitCheckoutModal:         state.app.gitCheckoutModal,
  gitCloneModal:            state.app.gitCloneModal,
  editTargetsAsCsvModal:    state.app.editTargetsAsCsvModal,
  editProjectModal:         state.app.editProjectModal,
  editEnvironmentsModal:    state.app.editEnvironmentsModal,
  appLightbox:              state.app.appLightbox,
  lightbox:                 state.app.lightbox,
  installRuntimeTestModal:  state.app.installRuntimeTestModal,
  projectFiles:             state.app.project.files,
  isProjectEmpty:           !state.app.project.files.length,
  isSuiteOpen:              !!state.suite.filename,
  // settings
  projectDirectory:         state.settings.projectDirectory,
  exportDirectory:          state.settings.exportDirectory,
  projects:                 state.settings.projects,
  // suite
  suiteFilename:            state.suite.filename,
  suiteModified:            state.suite.modified,
  suiteTargets:             state.suite.targets,
  // project
  projectName:              state.project.name,
  projectSavedAt:           state.project.savedAt,
  projectEnvironments:      state.project.environments,
  // git (for modals rendered directly in AppLayout)
  git:                      state.git,
  // snippets (for TestReportModal / ExportProjectModal / SnippetModal)
  snippets:                 state.snippets,
  project:                  state.project,
  cleanSnippets:            selectors.getCleanSnippetsMemoized(state),
})
```

Update `render()` to destructure these named props instead of `store.*`. Remove passing `app`,
`project`, `snippets`, `git`, `settings` to `<TabGroup>`. TabGroup will get them from Redux itself
(Change 2).

`<TabGroup>` should only receive: `action`, `selector` (no state data).

---

## Change 2 — `src/component/TabGroup.jsx`

**Problem:** Unconnected class; receives 8+ large props from AppLayout and passes subsets to
TestReport, SettingsPanel, and GitPane.

**Fix:** Connect to Redux. TabGroup itself only needs `tabs`, `suiteModified`, `suiteSnippets`,
`suiteFilename`, `suiteTitle` for its own render logic (tab titles + close confirmation).
The children it renders that need more data will be connected independently (Changes 3–5).

```js
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  tabs:          state.app.tabs,
  suiteModified: state.suite.modified,
  suiteSnippets: state.suite.snippets,
  suiteFilename: state.suite.filename,
  suiteTitle:    state.suite.description || state.suite.title,
});

@connect(mapStateToProps)
export class TabGroup extends React.Component { ... }
```

Remove from `propTypes` and `render()` destructuring: `app`, `project`, `snippets`, `git`,
`settings`, `suiteTargets`, `projectDirectory`. Pass nothing but `action` + `selector` to
`<TestReport>`, `<SettingsPanel>`, `<GitPane>`.

---

## Change 3 — `src/component/AppLayout/TestReport.jsx`

**Problem:** Unconnected; receives `project` (full), `snippets` (full), `targets`, `environment`,
`checkedList`, `headless`, `launcherArgs`, `passSuiteOptions`, `passExportOptions`,
`passProjectOptions` from TabGroup. No `shouldComponentUpdate` — re-renders on every TabGroup tick.

**Fix:** Add `@connect`:

```js
const mapStateToProps = (state) => ({
  targets:          state.suite.targets,
  projectDirectory: state.settings.projectDirectory,
  headless:         state.app.headless,
  launcherArgs:     state.app.launcherArgs,
  checkedList:      state.app.checkedList,
  environment:      state.app.environment,
  passSuiteOptions: state.app.passSuiteOptions,
  passExportOptions: state.app.passExportOptions,
  passProjectOptions: state.app.passProjectOptions,
  project:          state.project,
  snippets:         state.snippets,
});
```

Remove all those props from propTypes (keep only `action`, `selector`). Update TabGroup's
`testReport` pane to pass only `action` and `selector`.

---

## Change 4 — `src/component/AppLayout/Settings/SettingsPanel.jsx`

**Problem:** Unconnected; receives `settings` (full object) and `project` (full object). Re-renders
whenever TabGroup re-renders.

**Fix:** Add `@connect`:

```js
const mapStateToProps = (state) => ({
  settings: state.settings,
  settingsPanes: state.project.appPanels.settings.panes,
});
```

Use `settingsPanes` directly instead of `project.appPanels.settings.panes`. Keep passing `settings`
to `<GeneralPane>` as before (settings is a small object and changes rarely). Remove `project` and
`settings` from propTypes. Update TabGroup's `settings` pane to pass only `action`.

---

## Change 5 — `src/component/AppLayout/Project/Git/GitPane.jsx`

**Problem:** Unconnected; receives `git` (full git state) and `projectDirectory` via props. Spreads
`{...this.props}` to ConfigForm and RemoteForm, pulling everything through.

**Fix:** Add `@connect`:

```js
const mapStateToProps = (state) => ({
  git:              state.git,
  projectDirectory: state.settings.projectDirectory,
});
```

Remove `git` and `projectDirectory` from propTypes. Update TabGroup's `projectGit` pane to only
pass `action`.

---

## Files to modify

| File | Change |
|------|--------|
| [src/component/AppLayout.jsx](src/component/AppLayout.jsx) | Granularize mapStateToProps; stop passing data to TabGroup |
| [src/component/TabGroup.jsx](src/component/TabGroup.jsx) | Add @connect; remove data props from parent, strip pass-through props |
| [src/component/AppLayout/TestReport.jsx](src/component/AppLayout/TestReport.jsx) | Add @connect; remove all data props |
| [src/component/AppLayout/Settings/SettingsPanel.jsx](src/component/AppLayout/Settings/SettingsPanel.jsx) | Add @connect; remove project/settings props |
| [src/component/AppLayout/Project/Git/GitPane.jsx](src/component/AppLayout/Project/Git/GitPane.jsx) | Add @connect; remove git/projectDirectory props |

---

## Components NOT changed (already correct)

- `Main.jsx` — connected, granular selectors, has `shouldComponentUpdate`
- `Snippets.jsx` — connected, same pattern as Main
- `CommandTable.jsx` — connected, granular + memoized selectors
- `VariablesPane.jsx`, `TargetsPane.jsx` — connected
- `TargetSelect.jsx`, `ParamsFormBuilder.jsx` — connected

---

## Verification

1. `npm run lint` — must pass with no new warnings
2. `npm start:linux` — open project, open a suite, edit test commands while watching DevTools React
   Profiler. Before: AppLayout flashes on every keystroke. After: only the command row flashes.
3. Open/close modals (e.g. New Suite) — AppLayout should re-render but TestReport/SettingsPanel
   should not.
4. Switch between tabs (suite ↔ Test report) — TabGroup re-renders but Main should not.
