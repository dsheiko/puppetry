import uniqid from "uniqid";
import { SNIPPETS_GROUP_ID } from "constant";

function setEntity( arr, entity ) {
  return arr.map( record => ({ ...record, entity }) );
}

export function getTargetDataTable( targets ) {
  const data = setEntity( Object.values( targets ), "target" ),
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
  const data = setEntity( Object.values( record || {} ), entity ),
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
