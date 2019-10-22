# Puppetry 3.0.0

### Features
- improvement: add export format: human readable report
- improvement: add template expressions htmlOf, attributeOf, propertyOf
- improvement: new Test report UI with screenshot thumbnails and lightbox
- improvement: new CSS regression testing
- improvement: new interactive mode
- improvement: add page.waitForRequest
- improvement: add page.waitForResponse
- improvement: add page.waitForFileChooser
- improvement: add page.assertConsoleMessage
- improvement: add page.assertDialog
- improvement: add page.closeDialog
- improvement: extend target.assertVisible with options `displayed`, `visible`, `opaque`, `within the current viewport`
- improvement: all assertions accept the opposite assumptions (equal/not equal, contain/ doesn't contain)
- improvement: mixed type assertion simplified - one can assert only for string value. Exceptions are assertProperty/Attribute where additionally one can assert for boolean
- improvement: Jest/Puppeteer project (export) has option to run in Firefox ([custom build](https://www.npmjs.com/package/puppeteer-firefox))
- improvement: test steps and refs now support comments
- improvement: add suite autosave option
- improvement: add page.assertPerfomanceAssetWeight
- improvement: add page.assertPerfomanceAssetCount
- improvement: add page.assertPerfomanceTiming (page loading, redirection, network latency, processing)
- improvement: extend page.setViewport with list of predefined resolutions
- improvement: polish UX for every test step form
- improvement: support Chrome Extensions
- improvement: add ignoreHTTPSErrors launcher option
- improvement: support to test Google Analytics tracking (pageview, event, social)
- improvement: support for target chaining
  - querying within other element
  - querying in Shadow DOM
  - querying in iframe
- improvement: fix UI rendering performance
- improvement: add support for record operations (copy/paste, clone, delete, enable/disable) on selections

### Updates

- improvement: updated to Electron 6
- improvement: updated to Puppeteer 1.19
- improvement: updated to Jest 24.9

# Puppetry 2.0.4

### Bug fixes
- fix: issue #35, Puppetry was wrongly merging targets of the suite and snippets
- fix: Recorder should not capture click event on elements with computed style display: none, visibility: hidden
- fix: Recorder cleans up the suite before saving recording session
- fix: Snippets have independent targets
- fix: When Snippets panel open, it could not figure out the current suite and failed to run/export tests

### Features
- improve: Project explorer gets extra controls (add project, new project, new suite, save suite as)

# Puppetry 2.0.3

### Bug fixes
- fix: issue #33, jQuery is not loaded in Recorder, because node integration enabled and it atries to resolve modules as RequireJS
- fix: issue #34, Recorder wasn't capturing click event on INPUT[type=submit], duplicated state change on CHECKBOX

### Features
- improve UI: Recorder provided with log console

# Puppetry 2.0.2

### Bug fixes
- fix: CSS in Project Explorer for the scrollbar when too many items

### Features
- improve UI: add icon DevTools in the Suite recorder

# Puppetry 2.0.1

### Bug fixes
- fix: screenshot now accepts slashes in name
- fix: clean up suite's screenshots before running the suite
- fix: leave the editing mode (in a row) by pressing Esc
- fix: when creating a new project, reset project object in the state, rather then merge
- fix: target.assertPosition correctly asserts on bordering elements
- fix: target.assertContainsClass can used to ensure target doesn't contain a class
- fix: Test report of multiple suite with the same suite titles

### Features
- improve UI: add target.screenshot
- improve UI: add target.assertNodeCount
- improve UI: add target.assertTextCount

# Puppetry 2.0.0

### Bug fixes
- fix: adding record row is not expandable
- fix: update target in the suite recursively when target name changed

### Features
- improve UI: add modal Edit Project to change project name and get info about project and app location
- improve UI: app window is centered on the first display when one has multiple displays
- improve UI: faster way to manage data-table records (targets/groups/tests) by keeping the last row always in editing more
- improve UI: suite options moved under a tab and do not take space in main workspace
- improve UI: Suite panes menu (Target/Tests/...) set for sticky position (always accessible regardless of scrolling)
- improve UI: add Insert action for data table records, which injects an new empty record next to the selected one set editing mode
- improve UI: integration with GIT (local/remote)
- improve UI: added copy/paste. Now one can copy into clipboard target/group/test/command in one suite/GIT version and paste on another
- improve UI: Project Explorer gets support for multiple project
- improve UI: add dynamic environment variables
- improve UI: add templates
- improve UI: add command assignVarRemotely
- improve UI: add command assertVar