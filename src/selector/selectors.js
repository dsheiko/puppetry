import uniqid from "uniqid";
import { validate } from "bycontract";
import { SNIPPETS_GROUP_ID } from "constant";
import { createSelector } from "reselect";

function setEntity( arr, entity ) {
  return arr.map( record => ({ ...record, entity }) );
}

export function findCommandsByTestId( testId, groups ) {
  const values = Object.values( groups );
  for ( let group of values ) {
    if ( testId in group.tests ) {
      return group.tests[ testId ].commands;
    }
  }
  return null;
}

const stateGlobal = ( state ) => state,
      stateSnippets = ( state ) => state.snippets,
      stateSnippetsTargets = ( state ) => state.snippets.targets,
      stateSnippetsPages = ( state ) => state.snippets.pages,
      stateSuitePage = ( state ) => state.suite.pages,
      stateSuiteTargets = ( state ) => state.suite.targets,
      stateProjectTargets = ( state ) => state.project.targets,
      stateSuiteGroups = ( state ) => state.suite.groups,
      groupTests = ( group ) => group.tests,
      allTargets = ( state ) => ({
        targets: Object.assign({}, state.project.targets, state.suite.targets ),
        selection: state.selection
      });

export const getCleanSnippetsMemoized = createSelector( stateSnippets, getSnippets );
export const getSnippetsTestMemoized = createSelector( stateGlobal, getSnippetsTest );
export const getSnippetsAllTestsMemoized = createSelector( stateGlobal, getSnippetsAllTests );

export const getProjectTargetDataTableMemoized = createSelector( stateProjectTargets, getTargetDataTable );
export const getSnippetsTargetDataTableMemoized = createSelector( stateSnippetsTargets, getTargetDataTable );
export const getSuiteTargetDataTableMemoized = createSelector( stateSuiteTargets, getTargetDataTable );
export const getSuitePageDataTableMemoized = createSelector( stateSuitePage, getTargetDataTable );
export const getSuiteGroupsMemoized = createSelector( stateSuiteGroups,
  ( groups ) => getStructureDataTable( groups, "group" ) );
export const getGroupTestsMemoized = createSelector( groupTests,
  ( tests ) => getStructureDataTable( tests, "test" ) );
export const getSelectedTargetsMemoized = createSelector( allTargets,
  ({ targets, selection }) => getSelectedTargets( selection, targets ) );

const getCommandsArray = ( state, props ) => {
  const group = state.suite.groups[ props.groupId ];
  if ( typeof group === "undefined" ) {
    return {};
  }
  const test = group.tests[ props.testId ];
  if ( typeof test === "undefined" ) {
    return {};
  }
  return test.commands;
};

export const getCommandsMemoized = createSelector( getCommandsArray,
  ( commands ) => Object.values( commands )
    .map( record => ({ ...record, entity: "command" }) )
);


export function getActiveEnvironment( environments, environment ) {
  validate( arguments, [ "string[]", "string" ]);
  const [ firstEnv ] = environments;
  return environment || firstEnv;
}

export function getSelectedVariables( variables, env ) {
  validate( arguments, [ "object", "string" ]);
  return Object.values( variables )
    .filter( variable => variable.env === env && !variable.disabled )
    .reduce( ( carry, variable ) => ({
      ...carry,
      [ variable.name ]: variable.value
    }), {});
}

export function getVariableDataTable( variables, env ) {
  validate( arguments, [ "object", "string" ]);
  const matches = Object.values( variables ).filter( variable => variable.env === env ),
        data = setEntity( matches, "variable" ),
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
    entity: "variable"
  });

  return data;
}


export function getActiveTargets( targets ) {
  return Object.values( targets )
    .filter( target => ( !!target.target ) );
}


function getTarget( variable, targets ) {
  return Object.values( targets )
    .find( item => variable === item.target );
}

const getTargetChainRecursive = function( target, targets ) {
  const chain = [ target ];
  chainLen++;
  if ( chainLen > 10 ) {
    throw new Error( `Too many chains, it looks like a loop` );
  }
  if ( !target.ref ) {
    return chain;
  }
  const ref = targets[ target.ref ];
  return chain.concat( getTargetChainRecursive( ref, targets ) );
};

let chainLen;
export function getTargetChain( target, targets ) {
  chainLen = 0;
  return getTargetChainRecursive( target, targets ).reverse();
}

export function getTargetDataTable( targets ) {
  const data = setEntity( ( !targets ? [] : Object.values( targets ) ), "target" ),
        id = uniqid();

  data.push({
    disabled: false,
    editing: true,
    adding: true,
    id,
    key: id,
    target: "",
    selector: "",
    entity: "target"
  });

  return data;
}

export function getStructureDataTable( record, entity ) {
  const data = setEntity( Object.values( record || {}), entity ),
        id = uniqid();

  data.push({
    disabled: false,
    editing: true,
    adding: true,
    id,
    key: id,
    title: "",
    entity
  });

  return data;
}

/**
 *
 * @param {String} variable
 * @param {Object} targets
 * @returns {Boolean}
 */
export function hasTarget( variable, targets ) {
  return Boolean( getTarget( variable, targets ) );
}

/**
 *
 * @param {String[]} selection
 * @param {Object} targets
 * @returns {Object}
 */
export function getSelectedTargets( selection, targets ) {
  return Object.values( targets )
    .filter( target => selection.includes( target.target ) )
    .reduce( ( carry, target ) => {
      carry[ target.id ] = target;
      return carry;
    }, {});
}


export function getSnippets( snippets ) {
  return snippets.groups && snippets.groups.hasOwnProperty( SNIPPETS_GROUP_ID )
    ? snippets.groups[ SNIPPETS_GROUP_ID ].tests
    : {};
}

function getSnippetsAllTests( store ) {
   return store.snippets.groups && store.snippets.groups.hasOwnProperty( SNIPPETS_GROUP_ID )
    ? store.snippets.groups[ SNIPPETS_GROUP_ID ].tests
    : {};
}

export function getSnippetsTest( store ) {
  const tests = getSnippetsAllTests( store ),
        test = tests[ store.project.lastOpenSnippetId ] ?? null;

  return test;
}


const getSnippetsCommandsArray = ( test ) => {
  return test ? test.commands : [];
};

export const getSnippetsCommandsMemoized = createSelector( getSnippetsCommandsArray,
  ( commands ) => Object.values( commands )
    .map( record => ({ ...record, entity: "snippetscommand" }) )
);