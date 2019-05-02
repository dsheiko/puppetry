import uniqid from "uniqid";

export function getTargetDataTable( targets ) {
  const data = Object.values( targets ),
        id = uniqid();

  data.push({
    disabled: false,
    editing: true,
    adding: true,
    id,
    key: id,
    target: "",
    selector: ""
  });

  return data;
}

export function getStructureDataTable( record ) {
  const data = Object.values( record ),
        id = uniqid();

  data.push({
    disabled: false,
    editing: true,
    adding: true,
    id,
    key: id,
    title: ""
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