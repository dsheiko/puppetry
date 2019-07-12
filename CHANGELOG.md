# Puppetry 2.0.1

### Bug fixes
- fix: screenshot now accepts slashes in name
- fix: clean up suite's screenshots before running the suite
- fix: leave the editing mode (in a row) by pressing Esc 

### Features
- improve UI: add target.screenshot
- improve UI: add target.assertNodeCount

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