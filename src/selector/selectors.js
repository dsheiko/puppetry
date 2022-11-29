import uniqid from "uniqid";
import { validate } from "bycontract";
import { SNIPPETS_GROUP_ID } from "constant";
import { createSelector } from "reselect";

const NULL_SUITE = { tests: {}, targets: {} };

function getActiveAppTabData(tabs) {
  if (tabs.active === null) {
    return NULL_SUITE;
  }
  const fetch = tabs.panels.find((panel) => panel.id === tabs.active);
  return fetch ? fetch.data : NULL_SUITE;
}

// Plain filter, get meta of tab panels available,
// where EDITOR tabs are suite file, report and so on
export const getAppTabPanelsMemoized = createSelector(
  ( state ) => state.app.tabs,
  (tabs) =>
    tabs.panels.map((panel) => ({
      id: panel.id,
      type: panel.type,
      title: panel.data.title ?? "Loading...",
    }))
);
// get data of the active tab panel
export const getActiveAppTabDataMemoized = createSelector(
  ( state ) => state.app.tabs,
  getActiveAppTabData
);

export const getTargetDataTableMemoized = createSelector(
  ( state ) => state.app.tabs,
  (tabs) => {
    const { targets } = getActiveAppTabData(tabs),
      data = setEntity(!targets ? [] : Object.values(targets), "target"),
      id = uniqid();

    data.push({
      disabled: false,
      editing: true,
      adding: true,
      id,
      key: id,
      target: "",
      selector: "",
      entity: "target",
    });

    return data;
  }
);

// see src/component/AppLayout/Main/GroupTable/TestTable/CommandModal.jsx
export const getTargetObjMemoized = createSelector(
  ( state ) => state.app.tabs,
  (tabs) => {
    const { targets } = getActiveAppTabData(tabs);
    return targets;
  }
);

// see src/component/AppLayout/Main/GroupTable/TestTable.jsx
export const getTestDataTableMemoized = createSelector(
  ( state ) => state.app.tabs,
  (tabs) => {
    const { tests } = getActiveAppTabData(tabs);
    return getStructureDataTable(tests, "test");
  }
);

function getStructureDataTable(records, entity) {
  const data = setEntity(Object.values(records || {}), entity),
    id = uniqid();

  data.push({
    disabled: false,
    editing: true,
    adding: true,
    id,
    key: id,
    title: "",
    entity,
  });

  return data;
}

// see src/component/AppLayout/Main/GroupTable/TestTable.jsx
export const getProjectExpandedMemoized = createSelector(
  ( state ) => state.project.expanded,
  (expanded) =>
    Object.values(expanded)
      .filter((item) => Boolean(item.value))
      .map((item) => item.key)
);

// export const getCommandsMemoized = createSelector( getCommandsArray,
//   ( commands ) => Object.values( test.commands )
//     .map( record => ({ ...record, entity: "command" }) )
// );

function setEntity(arr, entity) {
  return arr.map((record) => ({ ...record, entity }));
}

export function findCommandsByTestId(testId, groups) {
  const values = Object.values(groups);
  for (let group of values) {
    if (testId in group.tests) {
      return group.tests[testId].commands;
    }
  }
  return null;
}

const stateSuitePage = ( state ) => state.suite.pages,
      stateSuiteTargets = ( state ) => state.suite.targets,
      stateProjectTargets = ( state ) => state.project.targets,
      stateSuiteGroups = ( state ) => state.suite.groups,
      stateSuiteTests = ( state ) => state.suite.tests,
      allTargets = ( state ) => ({
        targets: Object.assign({}, state.project.targets, state.suite.targets),
        selection: state.selection,
      });

/**
 * SNIPPET 
 */
export const getSnippetsMemoized = createSelector(
  ( state ) => state.snippets.tests,
  ( tests ) => tests
);
export const getSnippetsTestMemoized = createSelector(
  ( state ) => state,
  ( state ) => state.snippets.tests[ state.project.lastOpenSnippetId ] ?? null
);
export const getSnippetsTestDataTableMemoized = createSelector(
  ( state ) => state.snippets.tests,
  ( tests ) => getStructureDataTable( tests, "test" )
);

/**
 * PROJECT
 */

export const getSnippetsTargetDataTableMemoized = createSelector(
  ( state ) => state.snippets.targets,
  getTargetDataTable
);

export const getProjectTargetDataTableMemoized = createSelector(
  stateProjectTargets,
  getTargetDataTable
);

export const getSuiteTargetDataTableMemoized = createSelector(
  stateSuiteTargets,
  getTargetDataTable
);
export const getSuitePageDataTableMemoized = createSelector(
  stateSuitePage,
  getTargetDataTable
);

export const getSuiteGroupsMemoized = createSelector(
  stateSuiteGroups,
  (groups) => getStructureDataTable(groups, "group")
);

export const getSuiteTestsMemoized = createSelector(stateSuiteTests, (tests) =>
  getStructureDataTable(tests, "test")
);

export const getSelectedTargetsMemoized = createSelector(
  allTargets,
  ({ targets, selection }) => getSelectedTargets(selection, targets)
);

export function getActiveEnvironment(environments, environment) {
  validate(arguments, ["string[]", "string"]);
  const [firstEnv] = environments;
  return environment || firstEnv;
}

export function getSelectedVariables(variables, env) {
  validate(arguments, ["object", "string"]);
  return Object.values(variables)
    .filter((variable) => variable.env === env && !variable.disabled)
    .reduce(
      (carry, variable) => ({
        ...carry,
        [variable.name]: variable.value,
      }),
      {}
    );
}

export function getVariableDataTable(variables, env) {
  validate(arguments, ["object", "string"]);
  const matches = Object.values(variables).filter(
      (variable) => variable.env === env
    ),
    data = setEntity(matches, "variable"),
    id = uniqid();
  data.push({
    disabled: false,
    editing: true,
    adding: true,
    id,
    key: id,
    name: "",
    value: "",
    env,
    entity: "variable",
  });

  return data;
}

export function getActiveTargets(targets) {
  return Object.values(targets).filter((target) => !!target.target);
}

function getTarget(variable, targets) {
  return Object.values(targets).find((item) => variable === item.target);
}

const getTargetChainRecursive = function (target, targets) {
  const chain = [target];
  chainLen++;
  if (chainLen > 10) {
    throw new Error(`Too many chains, it looks like a loop`);
  }
  if (!target.ref) {
    return chain;
  }
  const ref = targets[target.ref];
  return chain.concat(getTargetChainRecursive(ref, targets));
};

let chainLen;
export function getTargetChain(target, targets) {
  chainLen = 0;
  return getTargetChainRecursive(target, targets).reverse();
}

export function getTargetDataTable( targets ) {
  const data = setEntity( !targets ? [] : Object.values( targets ), "target" ),
        id = uniqid();

  data.push({
    disabled: false,
    editing: true,
    adding: true,
    id,
    key: id,
    target: "",
    selector: "",
    entity: "target",
  });

  return data;
}

/**
 *
 * @param {String} variable
 * @param {Object} targets
 * @returns {Boolean}
 */
export function hasTarget(variable, targets) {
  return Boolean(getTarget(variable, targets));
}

/**
 *
 * @param {String[]} selection
 * @param {Object} targets
 * @returns {Object}
 */
export function getSelectedTargets( selection, targets ) {
  return Object.values( targets )
    .filter(( target ) => selection.includes( target.target ))
    .reduce(( carry, target ) => {
      carry[ target.id ] = target;
      return carry;
    }, {});
}


export const getSnippetsCommandsMemoized = createSelector(
  ( test ) => test ? test.commands : [],
  ( commands ) =>
    Object.values( commands ).map(( record ) => ({
      ...record,
      entity: "snippetscommand",
    }))
);
