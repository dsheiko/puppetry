import uniqid from "uniqid";
import { validate } from "bycontract";
import { SNIPPETS_GROUP_ID } from "constant";

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
 * @param {String} target
 * @param {Object} targets
 * @returns {Boolean}
 */
export function hasTarget( target, targets ) {
  return Boolean( Object.values( targets )
    .find( item => target === item.target ) );
}

/**
 *
 * @param {Array} selection
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
    : [];
}
