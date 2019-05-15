/**
 * @typedef {Object} CommandEntity
 * @property {string} id - entity id
 * @property {string} method - command method
 * @property {string} target - target
 * @property {Object.<string, string|number>} params - command params/options
 * @property {Object.<string, string|number>} assert - assertion params
 * @property {number} testId - id of parent group
 * @property {number} groupId - id of parent group
 * @property {boolean} disabled - shows if the data table row disabled
 * @property {boolean} editing - indicates if the data table row representing entity in editing mode
 * @property {string} key - required for rendering data table rows
 */

/**
 * @typedef {Object} TestEntity
 * @property {string} id - entity id
 * @property {string} title - entity title
 * @property {number} groupId - id of parent group
 * @property {Object.<string, CommandEntity>} commands - test commands
 * @property {boolean} editing - shows if the data table row in editing mode
 * @property {boolean} disabled - shows if the data table row disabled
 * @property {string} key - required for rendering data table rows
 */

/**
 * @typedef {Object} GroupEntity
 * @property {string} id - entity id
 * @property {string} title - entity title
 * @property {Object.<string, TestEntity>} tests - group tests
 * @property {boolean} editing - indicates if the data table row representing entity in editing mode
 * @property {string} key - required for rendering data table rows
 */

/**
 * @typedef {Object} TargetEntity
 * @property {string} id - entity id
 * @property {string} target - variable name
 * @property {string} selector - locator: CSS selector or XPath
 * @property {Object.<string, TestEntity>} tests - group tests
 * @property {boolean} adding
 * @property {boolean} editing - indicates if the data table row representing entity in editing mode
 * @property {string} key - required for rendering data table rows
 */

/**
 * @typedef {Object} ClipboardDTOApp
 * @property {string} name
 * @property {string} version - semver
 */

/**
 * @typedef {Object} ClipboardDTO
 * @property {ClipboardDTOApp} app
 * @property {GroupEntity|TestEntity|CommandEntity|TargetEntity} data
 * @property {string} model - Command|Test|Group|Target
 * @property {Object.<string, TargetEntity>} targets
 */

