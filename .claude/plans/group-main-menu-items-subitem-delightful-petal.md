# Plan: Restructure Main Menu to Match MODEL.md Hierarchy

## Context

The native Electron menu and the in-app Ant Design menu use inconsistent, outdated terminology ("Project", "Suite") that doesn't match the domain model defined in MODEL.md ("Test Plan", "Test Suite"). The native menu also lacks a Help menu and a macOS app menu, and all operations are dumped into a single ungrouped File menu. The goal is to rename labels to MODEL.md terms and regroup items following VS Code conventions (workspace-level vs document-level operations separated visually, dedicated Help menu, proper macOS app menu).

## Files to Change

- `app/main/menu.js` — native Electron menu template (primary change)
- `src/component/AppLayout/Sider/MainMenu.jsx` — in-app Ant Design menu (label renames only)

No changes needed to `app/constant/index.js` — all existing IPC event constants are reused. The Help > About uses `dialog.showMessageBox` from the main process directly (no IPC needed).

## Changes

### 1. `app/main/menu.js`

**Imports:** add `dialog` to the destructure from `"electron"`.

**buildAppMenu — new template structure:**

```
[macOS app menu — conditional on isMac]
File
Run
Edit
Window
Help
```

#### macOS app menu (prepended when `isMac`)
Standard Electron macOS app menu with roles: `about`, `services`, `hide`, `hideOthers`, `unhide`, `quit`.

#### File menu — two visual groups, separated by `type: "separator"`

Group 1 — Test Plan (workspace-level):
- "New Test Plan..."  → `E_MENU_NEW_PROJECT` (always enabled)
- "Open Test Plan..."  → `E_MENU_OPEN_PROJECT` (always enabled)
- separator
- "Export Test Plan for CI..."  → `E_MENU_EXPORT_PROJECT` (enabled: `projectDirectory`)

Group 2 — Test Suite (document-level):
- separator
- "New Test Suite..."  → `E_MENU_NEW_SUITE` (enabled: `projectDirectory`)
- "Open Test Suite..."  → `E_MENU_OPEN_SUITE` (enabled: `projectDirectory && files.length`)
- "Save Test Suite"  → `E_MENU_SAVE_SUITE` (enabled: `suiteFilename`)
- "Save Test Suite As..."  → `E_MENU_SAVE_SUITE_AS` (enabled: `suiteFilename`)

Group 3 — exit (non-macOS only):
- separator
- "Exit"  → `E_MENU_EXIT_APP` (suppressed on macOS — Quit lives in the app menu)

#### Run menu
- "Run Test Plan..."  → `E_MENU_RUN` (enabled: `projectDirectory`)

#### Edit menu
No changes — keep existing role-based items and platform conditionals verbatim.

#### Window menu
- `minimize` (all platforms)
- `zoom` (macOS only)
- separator (macOS only)
- `front` (macOS only)

#### Help menu (new)
```js
{
  label: "Help",
  submenu: [
    { label: "Documentation", click() { shell.openExternal("https://github.com/dsheiko/puppetry"); } },
    { label: "Report an Issue", click() { shell.openExternal("https://github.com/dsheiko/puppetry/issues"); } },
    { type: "separator" },
    {
      label: "About Puppetry",
      click() {
        dialog.showMessageBox(win, {
          type: "info",
          title: "About Puppetry",
          message: `Puppetry v${app.getVersion()}`,
          detail: "Codeless end-to-end test automation.\nhttps://github.com/dsheiko/puppetry",
          buttons: ["OK"]
        });
      }
    }
  ]
}
```
On macOS the native app menu already provides `role: "about"`, so the Help > About can be omitted or kept as redundant — keep it for discoverability (VS Code does the same).

---

### 2. `src/component/AppLayout/Sider/MainMenu.jsx`

Label-only renames in the JSX (no logic, no prop, no handler changes):

| Old label | New label |
|---|---|
| `New Suite...` | `New Test Suite...` |
| `Open Suite...` | `Open Test Suite...` |
| `Save Suite` | `Save Test Suite` |
| `Save Suite As...` | `Save Test Suite As...` |

(Other labels — "New Test Plan...", "Open Test Plan...", "Save Test Plan As...", "Export Test Plan as..." — are already correct in the in-app menu and need no change.)

---

## Verification

1. Run `npm run start:linux` — app launches in dev mode.
2. Open the native menu bar:
   - **File** shows two visual groups (Test Plan group, then Test Suite group after separator).
   - All labels use "Test Plan" / "Test Suite" terminology.
   - Test Suite items are disabled when no project is open; Save items disabled when no suite is loaded.
   - Exit absent on macOS, present on Linux/Windows.
3. On macOS: app menu (first menu) includes Hide/Quit; Help > About shows version dialog.
   On Linux/Windows: Help > About opens `dialog.showMessageBox`.
4. **Run** menu shows "Run Test Plan..." disabled until a project is open.
5. In-app menu File dropdown shows updated "New Test Suite...", "Open Test Suite...", "Save Test Suite", "Save Test Suite As..." labels.
6. All existing keyboard shortcuts (Ctrl+S, Ctrl+N, Ctrl+Shift+N, F6) continue to work via the in-app Hotkeys component (unchanged).
