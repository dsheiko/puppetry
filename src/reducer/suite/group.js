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
      [ actions.addGroup ]: ( state, { payload }) => {
        const { options, id } = normalizeComplexPayload( payload ),
              merge = {},
              gid = id || uniqid();
        merge[ gid ] = { ...groupDefaultState( gid ), ...options, tests: {}};

        return update( state, {
          groups: {
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
    [ actions.insertAdjacentGroup ]: ( state, { payload }) => {
      const { options, position, id } = normalizeComplexPayload( payload ),
            { groups }  = state,

            entities = Object.values( groups ).reduce( ( carry, group ) => {
              if ( position.before && position.before === group.id ) {
                const gid = id || uniqid();
                carry[ gid ] = { ...groupDefaultState( gid ), ...options, tests: {}};
              }
              carry[ group.id ] = group;
              if ( position.after && position.after === group.id ) {
                const gid = id || uniqid();
                carry[ gid ] = { ...groupDefaultState( gid ), ...options, tests: {}};
              }
              return carry;
            }, {});

      return update( state, {

          groups: {
            $set: entities
          }

      });
    },

    [ actions.swapGroup ]: ( state, { payload }) => {
      const srcArr = Object.values( state.groups ),
            source = { ...srcArr[ payload.sourceInx ] },
            resArr = update( srcArr, {
              $splice: [[ payload.sourceInx, 1 ], [ payload.targetInx, 0, source ]]
            });

      return update( state, {

          groups: {
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
    [ actions.updateGroup ]: ( state, { payload }) => {

      return update( state, {

          groups: {
            $apply: ( ref ) => {
              const groups = { ...ref },
                    id = payload.id;
              groups[ id ] = { ...groups[ id ], ...payload, id, key: id };
              if ( !groups[ id ].hasOwnProperty( "tests" ) ) {
                groups[ id ].tests = {};
              }
              return groups;
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
    [ actions.removeGroup ]: ( state, { payload }) => update( state, {

        groups: {
          $unset:[ payload.id ]
        }
      })

}


