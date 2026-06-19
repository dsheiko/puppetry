# Remove Git-Related Functionality

## Context

The app includes a full Git integration (init, commit, sync, clone, checkout) powered by `isomorphic-git`. This feature is being removed entirely: the menu items, modals, panel, Redux slice, IPC handlers, and the library dependency all go away. The app continues to work without any git operations.

---

## Files to Delete

```
src/reducer/git.js
src/action/git.js
src/interface/git.js
app/main/git-api.js
src/component/Modal/GitCommitModal.jsx
src/component/Modal/GitSyncModal.jsx
src/component/Modal/GitCheckoutModal.jsx
src/component/Modal/GitCloneModal.jsx
src/component/AppLayout/Project/Git/ConfigForm.jsx
src/component/AppLayout/Project/Git/RemoteForm.jsx
src/component/AppLayout/Project/Git/GitPane.jsx
src/component/Global/CheckoutMaster.jsx
src/component/AppLayout/Sider/MainMenu/GitEnhancedMenu.jsx
src/__tests__/reducer/git.spec.js
```

---

## Files to Modify

### `app/constant/index.js`
Remove 21 constant exports: all `E_GIT_*` lines (lines 28–49) and `E_CHECKOUT_MASTER_OPEN` / `E_CHECKOUT_MASTER_CLOSE` (lines 50–51).

### `app/main/event-dispatcher.js`
- Remove `gitApi = require("./git-api")` from the requires block; fix the trailing comma on the `path` require.
- Remove all `E_GIT_*` and `E_CHECKOUT_MASTER_*` names from the constants destructure at the top.
- Remove all 9 `ipcMain.on(E_GIT_*, ...)` handler blocks (lines ~142–234). `E_GIT_REVERT` has no handler body but must still be removed from the destructure.

### `src/service/io.js`
- Remove `GIT_FILE_NAME = ".puppetrygit"` from the constants block (adjust trailing comma).
- Remove `isGitInitialized(projectDirectory)` function.
- Remove `readGit(directory)` function.
- Remove `writeGit(directory, data)` function.

### `src/action/project.js`
- Remove `isGitInitialized` from the named import of `../service/io`.
- Remove `import gitActions from "./git"`.
- Remove `dispatch(gitActions.loadGit(projectDirectory))` call.
- Remove `dispatch(gitActions.setGit({ initialized: isGitInitialized(projectDirectory) }))` call.

### `src/action/index.js`
- Remove `import gitActions from "./git"`.
- Remove `...gitActions,` from the exported actions object.

### `src/reducer/defaultState.js`
- Remove the entire top-level `git: { ... }` object.
- Remove `gitLogs: []` and `gitDetachedHeadState: false` from the `app` object.
- Remove `gitCommitModal: false`, `gitSyncModal: false`, `gitCheckoutModal: false`, `gitCloneModal: false` from the `app` object.
- Remove `projectGit: false` from `tabs.available`.

### `src/reducer/index.js`
- Remove `import git from "./git"`.
- Remove `git,` from `combineReducers(...)`.

### `src/interface/app.js`
- Remove `gitLogs`, `gitDetachedHeadState`, `gitCommitModal`, `gitSyncModal`, `gitCheckoutModal`, `gitCloneModal` from `APP_OPTIONS`.

### `src/component/AppLayout/Sider/MainMenu.jsx`
- Remove `import { GitEnhancedMenu } from "./MainMenu/GitEnhancedMenu"`.
- Change `extends GitEnhancedMenu` → `extends React.PureComponent` (React is already imported).
- Remove `isGitInitialized`, `hasGitRemote`, `gitDetachedHeadState` from PropTypes declarations.
- Remove `"ctrl+shift+s": "onFileGitCommit"` and `"command+shift+s": "onFileGitCommit"` from `hotkeyMap`.
- Remove `this.gitEnhancedMenuDidMount()` call from `componentDidMount`.
- In `render()`: remove `isGitInitialized`, `hasGitRemote`, `gitDetachedHeadState` from the props destructure.
- Remove the entire `<SubMenu key="git" ...>` block (5 git menu items).
- Remove `<Menu.Item key="103" ... id="cMainMenuProjectGit">GIT</Menu.Item>`.

### `src/component/AppLayout.jsx`
- Remove imports: `CheckoutMaster`, `GitCommitModal`, `GitSyncModal`, `GitCheckoutModal`, `GitCloneModal`.
- Remove from `mapStateToProps`: `gitDetachedHeadState`, `gitLogs`, `gitCommitModal`, `gitSyncModal`, `gitCheckoutModal`, `gitCloneModal`, `git: state.git`.
- Remove those keys from PropTypes.
- In `render()` destructure: remove all git-related props.
- Remove git props passed to `<MainMenu>` (`gitDetachedHeadState`, `gitConfigUsername`, `gitConfigEmail`, `isGitInitialized`, `hasGitRemote`).
- Remove the 5 git JSX blocks: `<GitCommitModal />`, `<GitSyncModal />`, `<GitCheckoutModal />`, `<GitCloneModal />`, `<CheckoutMaster />`.

### `src/component/TabGroup.jsx`
- Remove `import { GitPane } from "./AppLayout/Project/Git/GitPane"`.
- Remove the `projectGit` entry from the `panes` object.

### `package.json`
- Remove `"isomorphic-git": "^0.78.4"` from dependencies.

---

## Execution Order

1. Delete all 14 files listed above.
2. `app/constant/index.js` (constants needed by event-dispatcher edit).
3. `app/main/event-dispatcher.js`.
4. `src/service/io.js` (exports needed by action/project.js edit).
5. `src/action/project.js` and `src/action/index.js` (parallel).
6. `src/reducer/defaultState.js`, `src/reducer/index.js`, `src/interface/app.js` (parallel).
7. `src/component/AppLayout/Sider/MainMenu.jsx`, `src/component/AppLayout.jsx`, `src/component/TabGroup.jsx` (parallel).
8. `package.json`.
9. Run `npm install` to update `package-lock.json`.

---

## Verification

1. `npm run lint` — must pass with no errors.
2. `npm run test` — git.spec.js is gone; remaining tests pass.
3. `npm run build` — webpack build succeeds.
4. `npm run start:linux` — app launches; File menu has no Git submenu; Test Plan tab has no GIT tab; no console errors on project load.
