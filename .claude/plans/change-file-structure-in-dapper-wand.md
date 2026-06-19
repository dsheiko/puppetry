# Plan: Change file structure in src/ for better maintainability

## Context

The `src/` directory has grown organically into a flat layer-per-concern structure that has several navigability and coupling problems:

- **Redux concerns are scattered** across three sibling dirs (`action/`, `reducer/`, `selector/`) with no indication they belong together. A developer changing a feature must jump between at least two directories.
- **`container/` holds one file** (`App.jsx`), adding a navigation hop with no grouping value.
- **`interface/` is misnamed** — it contains JS runtime contract definitions, not TypeScript interfaces; the name misleads contributors.
- **Services import from components**: `service/io.js`, `service/Export/TextConvertor.js`, and `service/smalltalk.js` import from `component/Schema/schema` and `component/Global/Message`, breaking the UI/logic boundary and creating a circular dependency risk.

## Proposed Changes

### 1. Consolidate Redux into `src/store/`

Move the three Redux directories under a single `store/` folder:

```
src/store/
  action/       ← moved from src/action/
  reducer/      ← moved from src/reducer/
  selectors.js  ← moved from src/selector/selectors.js
```

Then update all import paths. Affected files (36 total, across `component/`, `service/`, `container/`, and the store files themselves):

```bash
# Dry-run first, then apply:
grep -rn 'from "action/' src/ --include="*.js" --include="*.jsx"
grep -rn 'from "reducer/' src/ --include="*.js" --include="*.jsx"
grep -rn 'from "selector' src/ --include="*.js" --include="*.jsx"
```

Mechanical sed replacements:
- `from "action/` → `from "store/action/`
- `from "reducer/` → `from "store/reducer/`
- `from "selector` → `from "store/selector`

Update `src/index.jsx` relative import:
- `from "./reducer"` → `from "./store/reducer"`

Update `__tests__/` test files that import from `action/`, `reducer/`, `selector/`.

### 2. Dissolve `container/` — move App.jsx into `component/`

`src/container/App.jsx` → `src/component/App.jsx`

Update `src/index.jsx`:
- `from "./container/App.jsx"` → `from "component/App"`

No other files import from `container/` (confirmed by grep).

### 3. Rename `interface/` → `types/`

Rename directory: `src/interface/` → `src/types/`

Update 6 import statements (`from "interface"` → `from "types"`):
- `src/action/app.js`
- `src/action/suite.js`
- `src/action/group.js`
- `src/action/target.js`
- `src/action/settings.js`
- `src/action/test.js`

### 4. Fix service → component coupling

Three service files import from `component/`:
- `service/io.js` → `import { IoError, ... } from "error"` (already fine), but also imports `component/Schema/schema`
- `service/Export/TextConvertor.js` → imports `component/Schema/schema`
- `service/smalltalk.js` → imports `component/Global/Message`

Resolution:
- Move `component/Schema/schema.js` (the data, not a UI component) → `store/schema.js` (it is domain/entity data)
- Update the 2 service files that import it, and all `component/Schema/**` files that import it (most of the 123 Schema files likely import from this)
- For `service/smalltalk.js` importing `component/Global/Message`: extract the `Message` usage into a callback/prop pattern or move the UI concern to the call site

> **Note:** Before executing step 4, read `component/Schema/schema.js` to understand its size and whether any Schema components import it differently. This step may be scoped separately if `schema.js` is tightly coupled to Schema component internals.

## Critical Files to Modify

| File | Change |
|------|--------|
| `webpack.config.js` | No change needed (imports are updated directly) |
| `src/index.jsx` | Update 2 relative imports (reducer, App) |
| `src/action/*.js` (6 files) | Update `"interface"` → `"types"` |
| 36 files importing `action/`, `reducer/`, `selector/` | Mechanical path prefix update |
| `src/__tests__/**` | Update any mirroring paths |

## Execution Order

1. Steps 2 and 3 (dissolve container/, rename interface/) — isolated, low risk, ~10 file changes
2. Step 1 (store/ consolidation) — mechanical but wide-reaching, do in one commit
3. Step 4 (decouple services) — validate scope first, may be a separate PR

## Verification

```bash
npm run build          # webpack build succeeds with no unresolved module errors
npm run lint           # no ESLint import errors
npm run test           # unit tests still pass
npm run start:linux    # app boots, UI renders correctly
```
