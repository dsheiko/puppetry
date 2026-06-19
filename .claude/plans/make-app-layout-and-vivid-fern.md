# Plan: VS Code-like App Layout

## Context

The current Puppetry layout has a left Ant Design `Sider` (with logo + vertical menu + project explorer) and a separate toolbar header on the right content area. The request is to restructure it to match VS Code's chrome pattern:
- A single compact title/menu bar across the top (logo + horizontal menu + window controls)
- A left Explorer panel with two collapsible sections: "OPEN EDITORS" and the project's suite list
- No separate tall toolbar on the right side

---

## Changes

### 1. `app/main.js` — Window size
Change `APP_WIN_WIDTH` from `1200` → `1280` and `APP_WIN_HEIGHT` from `720` → `800` (VS Code default proportions).

---

### 2. NEW `src/component/AppLayout/TitleBar.jsx`
Replaces `Toolbar.jsx`. A single horizontal bar combining:
- Small logo (`./assets/puppetry.svg`, ~22 px) on the far left
- `<MainMenu>` in `mode="horizontal"` (inline, not in sidebar)
- Project name + edit-icon button in the center (flex-grow spacer)
- Minimize / restore / close window controls on the far right

Props received: all of `Toolbar`'s props + all of `MainMenu`'s props (merge the two prop lists).  
`-webkit-app-region: drag` on the bar; `no-drag` on every interactive child.  
Class: `vsc-titlebar`.

---

### 3. Modify `src/component/AppLayout/Sider/MainMenu.jsx`
- Change the hard-coded `mode="vertical"` on `<Menu>` to `mode="horizontal"`.
- Remove `theme="dark"` (or keep it — the horizontal dark theme fits the title bar).
- No other logic changes; hotkeys and IPC listeners are unaffected.

---

### 4. NEW `src/component/AppLayout/ExplorerSidebar.jsx`
Replaces the Ant Design `<Sider>`. A plain `<div className="vsc-explorer">` (250 px wide) with two collapsible sections driven by local `state = { openEditorsOpen: true, projectOpen: true }`:

**OPEN EDITORS section**
```
▼ OPEN EDITORS
  📄 suite1.yml        ← only shown when suiteFilename is set
```
- Shows `suiteFilename` (basename) when a suite is open.
- Clicking the item is a no-op (it's already the active editor).
- Section hidden (no items) when no suite is open.

**PROJECT section**
```
▼ PROJECT: My Project
  📄 suite1.yml  ← highlighted when active
  📄 suite2.yml
```
- Renders the existing `<ProjectExplorer>` component as the body (no changes to ProjectExplorer itself).
- Section header shows the project name.

Props: same as the old `<Sider>` content (`projectFiles`, `projects`, `projectDirectory`, `suiteFilename`, `suiteModified`, `action`).

---

### 5. Modify `src/component/AppLayout.jsx`
Replace the current render structure:

**Before:**
```jsx
<Layout id="cLayout" className="layout">
  <Sider collapsible ...>
    <div className="logo ..."> ... </div>
    <MainMenu ... />
    { projectFiles.length && <ProjectExplorer ... /> }
  </Sider>
  <Layout>
    <Toolbar projectName={...} ... />
    <div className="layout-content"> ... </div>
    <AppFooter ... />
  </Layout>
</Layout>
```

**After:**
```jsx
<Layout id="cLayout" className="layout">
  <TitleBar
    projectName={projectName}
    suiteModified={suiteModified}
    action={action}
    isProjectEmpty={!projectFiles.length}
    isSuiteOpen={!!suiteFilename}
    isProjectOpen={!!projectDirectory}
    readyToRunTests={!!readyToRunTests}
  />
  <Layout className="layout-body">
    <ExplorerSidebar
      projectDirectory={projectDirectory}
      projects={projects}
      projectFiles={projectFiles}
      suiteFilename={suiteFilename}
      suiteModified={suiteModified}
      action={action}
    />
    <Layout className="layout-right">
      <div className="layout-content"> ... </div>
      <AppFooter action={action} />
    </Layout>
  </Layout>
</Layout>
```

Remove the import of `Toolbar`, `MainMenu` (it moves inside `TitleBar`). Add imports for `TitleBar` and `ExplorerSidebar`.  
Remove the `collapsed` local state (no longer needed).

---

### 6. `app/assets/app.css` — Layout styles

**Add new rules:**

```css
/* Title bar */
.vsc-titlebar {
  height: 38px;
  flex: 0 0 38px;
  display: flex;
  align-items: center;
  background: #001629;
  -webkit-app-region: drag;
  z-index: 1000;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.vsc-titlebar__logo {
  width: 22px;
  height: 22px;
  margin: 0 6px 0 10px;
  flex-shrink: 0;
  -webkit-app-region: no-drag;
}
.vsc-titlebar__spacer {
  flex: 1 1 auto;
}
.vsc-titlebar__project {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  padding: 0 8px;
  -webkit-app-region: no-drag;
}
.vsc-titlebar__controls {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 8px;
  -webkit-app-region: no-drag;
}
.vsc-titlebar__controls .layout-icon {
  font-size: 18px;
  color: rgba(255,255,255,0.7);
  margin-left: 4px;
}
.vsc-titlebar__controls .layout-icon:hover {
  color: white;
}

/* Explorer sidebar */
.vsc-explorer {
  width: 250px;
  min-width: 250px;
  background: #002140;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255,255,255,0.08);
  overflow-y: auto;
  overflow-x: hidden;
  user-select: none;
}
.vsc-explorer-heading {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  padding: 12px 12px 4px 12px;
  flex-shrink: 0;
}
.vsc-explorer-section__header {
  height: 24px;
  line-height: 24px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  padding: 0 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.vsc-explorer-section__header:hover {
  background: rgba(255,255,255,0.06);
}
.vsc-explorer-item {
  height: 22px;
  line-height: 22px;
  padding: 0 0 0 28px;
  font-size: 13px;
  color: rgba(255,255,255,0.65);
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  gap: 6px;
}
.vsc-explorer-item.is-active {
  background: #00529e;
  color: white;
}
.vsc-explorer-item:hover:not(.is-active) {
  background: rgba(255,255,255,0.08);
}

/* Layout body */
.layout-body {
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  overflow: hidden;
  height: calc(100vh - 38px);
}
.layout-right {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: hidden;
}
```

**Update existing rules:**

- `.layout`: keep `min-height: 100vh`; add `display: flex; flex-direction: column;`
- `.layout-content`: change `height: calc(100vh - 52px - 52px)` → `flex: 1 1 auto; height: auto; overflow-y: auto;`
- `.toolbar`: can stay for now (only used internally in old component — will become dead code after Toolbar.jsx is replaced)
- `.logo`: can stay (dead code after AppLayout.jsx is updated)
- Fix all `calc(100vh - 52px - ...)` references (sticky tabs panel rules) to use `calc(100vh - 38px - ...)`

**Horizontal menu in title bar (compact):**
```css
/* Compact Ant Design horizontal menu inside title bar */
.vsc-titlebar #cMainMenu.ant-menu-horizontal {
  line-height: 38px;
  background: transparent;
  border-bottom: none;
  -webkit-app-region: no-drag;
}
.vsc-titlebar #cMainMenu.ant-menu-horizontal > .ant-menu-item,
.vsc-titlebar #cMainMenu.ant-menu-horizontal > .ant-menu-submenu {
  height: 38px;
  line-height: 38px;
  padding: 0 10px;
  color: rgba(255,255,255,0.75);
  border-bottom: none;
  top: 0;
}
.vsc-titlebar #cMainMenu.ant-menu-horizontal > .ant-menu-item:hover,
.vsc-titlebar #cMainMenu.ant-menu-horizontal > .ant-menu-submenu:hover,
.vsc-titlebar #cMainMenu.ant-menu-horizontal > .ant-menu-item-active,
.vsc-titlebar #cMainMenu.ant-menu-horizontal > .ant-menu-submenu-active {
  background: rgba(255,255,255,0.12);
  border-bottom: none;
  color: white;
}
.vsc-titlebar #cMainMenu .ant-menu-submenu-title {
  color: rgba(255,255,255,0.75);
}
```

---

## Height constant updates

All occurrences of `52px` in the sticky-tabs calculations refer to the old `Toolbar` height. After the change, the title bar is `38px`. The footer (`AppFooter`) stays at `~52px` and lives inside `.layout-right`.

Sticky panel rules to update (all in `app/assets/app.css`):
- `.has-sticky-tabs-panel .ant-tabs-content...` height
- `.tabpane-frame`, `.subtabpane-frame` height  
- `.report-panel-tab` height  
- `.is-checkbox-group-scrollable` height

Each `calc(100vh - 52px - 52px - ...)` → `calc(100vh - 38px - 52px - ...)`  
Each `calc(100vh - 52px - ...)` that was toolbar-only → `calc(100vh - 38px - ...)`

---

## Verification

1. Run `npm run start:linux` and check:
   - Title bar at top: logo → File/Test Plan/Settings/Run menu → project name → window controls
   - Clicking "File" shows the dropdown submenu
   - Left sidebar shows "EXPLORER" heading with "OPEN EDITORS" and "PROJECT" sections
   - Opening a suite populates "OPEN EDITORS"; the suite list appears in "PROJECT"
   - Minimize / maximize / close buttons work
   - No layout overflow or height miscalculation visible
2. Run `npm run lint` — no new lint errors.
