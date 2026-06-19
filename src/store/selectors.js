import uniqid from "uniqid";
import { validate } from "bycontract";
import { createSelector } from "reselect";

function setEntity( arr, entity ) {
  return arr.map( record => ({ ...record, entity }) );
}

export function findCommandsByTestId( testId, tests ) {
  return tests && tests[ testId ] ? tests[ testId ].commands : null;
}

const stateSnippets = ( state ) => state.snippets,
      stateSuiteTargets = ( state ) => state.suite.targets,
      stateProjectTargets = ( state ) => state.project.targets,
      stateSuiteTests = ( state ) => state.suite.tests,
      allTargets = ( state ) => ({
        targets: Object.assign({}, state.project.targets, state.suite.targets ),
        selection: state.selection
      });

export const getCleanSnippetsMemoized = createSelector( stateSnippets, getSnippets );
export const getProjectTargetDataTableMemoized = createSelector( stateProjectTargets, getTargetDataTable );
export const getSuiteTargetDataTableMemoized = createSelector( stateSuiteTargets, getTargetDataTable );
export const getSuiteTestsMemoized = createSelector( stateSuiteTests,
  ( tests ) => getStructureDataTable( tests, "test" ) );
export const getSelectedTargetsMemoized = createSelector( allTargets,
  ({ targets, selection }) => getSelectedTargets( selection, targets ) );

const getCommandsArray = ( state, props ) => {
  const test = state.suite.tests[ props.testId ];
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

export function hasTarget( variable, targets ) {
  return Boolean( getTarget( variable, targets ) );
}

export function getSelectedTargets( selection, targets ) {
  return Object.values( targets )
    .filter( target => selection.includes( target.target ) )
    .reduce( ( carry, target ) => {
      carry[ target.id ] = target;
      return carry;
    }, {});
}


export function getSnippets( snippets ) {
  return snippets && snippets.tests ? snippets.tests : {};
}
