import uniqid from "uniqid";
import actions from "action";
import update from "immutability-helper";
import {
  updateTagetsInSuite,
  getTestsFlat,
  getCommandsFlat,
  transferTest,
  transferCommand,
  isTargetNotUnique,
  normalizeComplexPayload,
  normalizePayload
} from "reducer/helpers";

import DEFAULT_STATE, {
  groupDefaultState,
  testDefaultState,
  commandDefaultState,
  targetDefaultState
} from "reducer/defaultState";


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
  [ actions.addTarget ]: ( state, { payload }) => {
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
   [ actions.insertAdjacentTarget ]: ( state, { payload }) => {
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

   [ actions.clearTarget ]: ( state ) => update( state, {
      targets: {
        $set: {}
      }
     }),

   /**
   * Payload:
   *  - sourceInx (0..N)
   *  - targetInx (0..N)
   *  - sourceId
   *  - targetId
   */
   [ actions.swapTarget ]: ( state, { payload }) => {
     const srcArr = Object.values( state.targets ),
           source = { ...srcArr[ payload.sourceInx ] },
           resArr = update( srcArr, {
             $splice: [[ payload.sourceInx, 1 ], [ payload.targetInx, 0, source ]]
           });

     return update( state, {
        targets: {
          $set: resArr.reduce( ( carry, item ) => {
            carry[ item.id ] = item;
            return carry;
          }, {})
        }
     });
   },

  /**
    * Update record
    * @param {object} state
    * @param {Entity} payload (EntityRef required)
    * @returns {object}
    */
   [ actions.updateTarget ]: ( state, { payload }) => {
     if ( isTargetNotUnique( state, payload ) ) {
       payload.target += "_" + uniqid().toUpperCase();
     }
     const newState = update( state, {

         targets: {
           $apply: ( ref ) => {
             const targets = { ...ref },
                   id = payload.id;
             targets[ id ] = { ...targets[ id ], ...payload, key: id };
             return targets;
           }
         }
       });

     return updateTagetsInSuite( state, newState, payload.id );
   },

  /**
   * Remove record
   * @param {object} state
   * @param {EntityRef} payload
   * @returns {object}
   */
   [ actions.removeTarget ]: ( state, { payload }) => update( state, {
       targets: {
         $unset:[ payload.id ]
       }
     })


}


