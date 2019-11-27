import uniqid from "uniqid";
import actions from "action";
import update from "immutability-helper";
import {
  isTargetNotUnique,
  normalizeComplexPayload
} from "reducer/helpers";

import { targetDefaultState } from "reducer/defaultState";


/**
 * @typedef {object} Position
 * @property {string} [before] - reference id to inject before
 * @property {string} [after] - reference id to inject after
 */

/**
 * @typedef {object} EntityRef
 * @property {string} id
 */

/**
 * @typedef {object} Entity - Contents of test
 */

/**
 * Contents of test
 * @typedef {object} Payload
 * @property {Entity} options
 * @property {string} [id] - when given it's used as id, otherwise a new id is generated
 * @property {Position} [position]
 */

export default {

  /**
  * Add record
  * @param {object} state
  * @param {Payload} payload
  * @returns {object}
  */
  [ actions.addSharedTarget ]: ( state, { payload }) => {
    const { options, id } = normalizeComplexPayload( payload ),
          merge = {},
          gid = id || uniqid();

    if ( options.target && isTargetNotUnique( state, options ) ) {
      options.target += "_" + uniqid().toUpperCase();
    }

    merge[ gid ] = { ...targetDefaultState( gid ), ...options };

    return update( state, {
      targets: {
        $merge: merge
      }
    });
  },

  /**
   * Insert record before/after
   * @param {object} state
   * @param {Payload} payload
   * @returns {object}
   */
  [ actions.insertAdjacentSharedTarget ]: ( state, { payload }) => {
    const { options, position, id } = normalizeComplexPayload( payload ),
          { targets }  = state;

    if ( options.target && isTargetNotUnique( state, options ) ) {
      options.target += "_" + uniqid().toUpperCase();
    }

    const entities = Object.values( targets ).reduce( ( carry, target ) => {
      if ( position.before && position.before === target.id ) {
        const gid = id || uniqid();
        carry[ gid ] = { ...targetDefaultState( gid ), ...options };
      }
      carry[ target.id ] = target;
      if ( position.after && position.after === target.id ) {
        const gid = id || uniqid();
        carry[ gid ] = { ...targetDefaultState( gid ), ...options };
      }
      return carry;
    }, {});

    return update( state, {
      targets: {
        $set: entities
      }
    });
  },

  [ actions.clearSharedTarget ]: ( state ) => update( state, {
    targets: {
      $set: {}
    }
  }),


  /**
    * Update record without saving
    * @param {object} state
    * @param {Entity} payload (EntityRef required)
    * @returns {object}
    */
  [ actions.setSharedTarget ]: ( state, { payload }) => {
    return update( state, {
      targets: {
        $apply: ( ref ) => {
          const targets = { ...ref },
                id = payload.id;
          targets[ id ] = { ...targets[ id ], ...payload, key: id };
          return targets;
        }
      }
    });
  },

  /**
    * Update record
    * @param {object} state
    * @param {Entity} payload (EntityRef required)
    * @returns {object}
    */
  [ actions.updateSharedTarget ]: ( state, { payload }) => {
    if ( isTargetNotUnique( state, payload ) ) {
      payload.target += "_" + uniqid().toUpperCase();
    }
    return update( state, {

      targets: {
        $apply: ( ref ) => {
          const targets = { ...ref },
                id = payload.id;
          targets[ id ] = { ...targets[ id ], ...payload, key: id };
          return targets;
        }
      }
    });
  },

  /**
   * Remove record
   * @param {object} state
   * @param {EntityRef} payload
   * @returns {object}
   */
  [ actions.removeSharedTarget ]: ( state, { payload }) => update( state, {
    targets: {
      $unset:[ payload.id ]
    }
  })


};


