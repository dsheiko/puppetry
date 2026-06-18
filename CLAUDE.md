# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Dev mode (Electron + hot reload, ELECTRON_ENV=dev)
npm run start:linux    # Dev mode on Linux (skips ELECTRON_RUN_AS_NODE env var)
npm run start:clean    # Dev with fresh app state (PUPPETRY_CLEAN_START=true)
npm run build          # Production webpack build → app/build/index.js
npm run watch          # Webpack watch mode
npm run test           # Unit tests (jest.cfg.unit.js)
npm run test:e2e       # E2E tests, sequential, clears screenshots first
npm run lint           # ESLint over src/ (.js, .jsx)
npm run lint:fix       # Auto-fix ESLint issues
```

Run a single unit test file:
```bash
npx jest --config=jest.cfg.unit.js src/__tests__/reducer/suite.spec.js
```

## Architecture

This is an **Electron 12 desktop app** split into two processes:

### Main process (`app/`)
- `app/main.js` — creates the BrowserWindow, registers three modules: `menu`, `capturePage`, `event-dispatcher`
- `app/main/event-dispatcher.js` — all IPC between renderer and main process. Events are `E_`-prefixed constants defined in `app/constant/index.js`
- `app/main/test-runner.js` — spawns Puppeteer to run the generated Jest tests
- `app/recorder/` — a separate Electron window for recording browser interactions

### Renderer process (`src/`)
Webpack bundles `src/index.jsx` → `app/build/index.js`, which is loaded by `app/index.html`.

**Redux store shape** (`src/reducer/index.js`):
```
{
  settings,   // user preferences (browser, project dir)
  app,        // UI state (loading, active tabs, lightbox)
  git,        // branch, commits, remote
  project,    // project metadata, open suite list
  suite,      // active suite: groups / tests / commands / targets
  snippets    // reusable test snippets
}
```

Middleware: `redux-thunk` + `redux-promise`. Store is wrapped with `redux-devtools-extension` in dev mode.

**Navigation** is state-driven — no React Router. Active suite tabs live in `state.project.appPanels.suite.panes`. Top-level rendering is `src/container/App.jsx` → `src/component/AppLayout/Main.jsx` → Ant Design Tabs.

**Selectors** (`src/selector/selectors.js`) use `reselect` and must be used for any derived data passed to connected components.

### IPC pattern
Renderer imports constants from `app/constant/index.js` and calls `ipcRenderer.send(E_FOO, payload)`. Main registers `ipcMain.on(E_FOO, handler)` inside `event-dispatcher.js` and replies via `mainWindow.webContents.send(E_BAR, result)`.

### Test generation
`src/service/TestGenerator.js` converts the Redux suite state (JSON) into runnable Jest + Puppeteer test files. This is the core output of the app.

## Key conventions

- **Actions** use `redux-actions` `createActions()`. Arguments are validated with `bycontract.validate()` — it throws on type mismatch, so actions document their own contracts.
- **Connected components** use the `@connect(mapState, mapDispatch)` decorator (class components, pre-Hooks).
- **Logging** uses `electron-log` everywhere (works in both processes); avoid bare `console.log`.
- **Unit test fixtures** live in `src/__tests__/__fixtures/`. Tests are `*.spec.js[x]` files under `**/__tests__/`.
- **E2E tests** are in `src/__e2e__/specs/` and run sequentially with `--runInBand`.
- The project uses **no TypeScript** — `bycontract` provides runtime contract validation instead.


# React + Electron Optimization Rules

## Rendering

- No inline component definitions
- No expensive calculations during render
- Memoize only when profiler proves benefit
- Virtualize large lists


## Electron

- nodeIntegration=false
- contextIsolation=true
- sandbox=true
- All IPC channels typed
- Validate every IPC payload

## Performance

- Bundle analyzer must pass
- Route-level code splitting
- Dynamic import heavy libraries
- Tree-shaking required

## Security

- CSP enabled
- No eval
- Sanitize all user content

## DX

- ESLint no warnings

## Accessibility

- Keyboard navigation
- ARIA labels
- Focus management

## Human-Like Writing Style Requirements

When generating user-facing text (emails, support replies, notifications, release notes, UI text, documentation, etc.), avoid writing patterns commonly associated with AI-generated content.

### Punctuation and Formatting
- Never use em dashes (`—`)
- Prefer simple punctuation:
  - commas
  - periods
  - parentheses if needed
- Avoid excessive semicolons
- Avoid perfectly symmetrical sentence structures
- Avoid overuse of quotation marks for emphasis

### Tone
- Prefer concise, direct wording
- Avoid overly polished customer-support phrasing
- Avoid corporate filler language
- Avoid dramatic transitions like:
  - "It looks like..."
  - "Please note that..."
  - "Kindly be aware..."
  - "Here's what happened..."
- Avoid motivational or overly empathetic phrasing unless explicitly requested

### Sentence Structure
- Prefer slightly imperfect, natural sentence rhythm
- Mix short and medium-length sentences
- Avoid repetitive patterns like:
  - explanation
  - reassurance
  - call to action
- Avoid excessive connective words:
  - however
  - furthermore
  - additionally
  - moreover

### Style
- Write like an experienced engineer or support agent communicating naturally
- Prefer practical clarity over polished prose
- Keep messages compact
- Remove unnecessary transitions and softeners
- Avoid sounding like marketing copy or AI assistant output

### Examples

Avoid:
> It looks like your verification link may have expired before you had a chance to use it.

Prefer:
> Your verification link expired.

Avoid:
> Here's a fresh one — valid for another 30 minutes:

Prefer:
> New link (valid for 30 minutes):

Avoid:
> If you're having trouble, just reply here and one of our agents will help.

Prefer:
> If this still does not work, reply to this message.