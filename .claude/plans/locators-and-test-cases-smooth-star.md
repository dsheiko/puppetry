# Plan: Fix slow Locators / Test Cases tab switching

## Context

Switching between the two sub-editors (Locators and Test Cases) under an open Suite tab is noticeably slow. The cause is not React Router or mounting cost — Ant Design `<Tabs animated={false}>` already keeps both TabPanes mounted and just CSS-toggles visibility. The bottleneck is artificial: `onTabChange` in `Main.jsx` dispatches `setApp({ loading: true })`, waits 10 ms, dispatches `updateProjectPanes`, then dispatches `setApp({ loading: false })`. That is 3 Redux dispatches and ~3 full re-renders of the entire app tree for what should be an instant CSS switch. The `app.loading` flag is consumed by a connected `<Spin>` high in the tree, causing everything beneath it to re-render.

The keyboard shortcut handler (`onKeyDown`) already calls `updateProjectPanes` directly without any loading wrapper, proving the simpler path works.

React Router is not a suitable fix here: not installed, this is an Electron app (no URL bar), and MemoryRouter would unmount inactive routes on switch (worse, not better).

## Changes

### 1. Remove the loading wrapper from `onTabChange`

**File:** `src/component/AppLayout/Main.jsx`, lines 59-65

Replace:
```javascript
onTabChange = ( targetKey ) => {
  this.props.action.setApp({ loading: true });
  setTimeout( () => {
    this.props.action.updateProjectPanes( "suite", [ targetKey ]);
    this.props.action.setApp({ loading: false });
  }, 10 );
}
```

With:
```javascript
onTabChange = ( targetKey ) => {
  this.props.action.updateProjectPanes( "suite", [ targetKey ] );
}
```

This makes `onTabChange` consistent with the existing `onKeyDown` handler. Reduces 3 dispatches to 1.

### 2. Add `shouldComponentUpdate` to `TestTable`

**File:** `src/component/AppLayout/Main/TestTable.jsx`

`TestTable` has no `shouldComponentUpdate` (neither do its base classes `AbstractEditableTable` or `AbstractDnDTable`), so it re-renders on every parent re-render. After change 1, `Main` still re-renders once when `panes` changes — and `TestTable` needlessly diffs its full Ant Design `<Table>` virtual DOM even though none of its props changed.

Add to the `TestTable` class (after the constructor):
```javascript
shouldComponentUpdate( nextProps, nextState ) {
  if ( this.state !== nextState ) return true;
  if ( this.props.tests !== nextProps.tests ) return true;
  if ( this.props.targets !== nextProps.targets ) return true;
  if ( this.props.expanded !== nextProps.expanded ) return true;
  return false;
}
```

`action` and `selector` are stable references (bound once in `App.jsx`) and don't need guarding. This mirrors the existing pattern in `TargetTable.jsx`.

## Files to modify

- `src/component/AppLayout/Main.jsx` — primary change
- `src/component/AppLayout/Main/TestTable.jsx` — add shouldComponentUpdate

## Verification

1. Run `npm run start:linux`
2. Open a suite file
3. Click between Locators and Test Cases tabs — switch should be instant, no spinner flash
4. Ctrl+Tab between tabs — same, still works
5. Add/edit a locator or test case — tables still update correctly
6. Run `npm run test` to confirm no unit test regressions
