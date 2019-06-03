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
      [ actions.addStest ]: ( state, { payload }) => {
        const { options, id } = normalizeComplexPayload( payload ),
              merge = {},
              gid = id || uniqid();
        merge[ gid ] = { ...groupDefaultState( gid ), ...options, commands: {}};

        return update( state, {
            $merge: merge
        });
      },


     /**
     * Insert record before/after
     * @param {object} state
     * @param {Payload} payload
     * @returns {object}
     */
    [ actions.insertAdjacentStest ]: ( state, { payload }) => {
      const { options, position, id } = normalizeComplexPayload( payload ),

            entities = Object.values( state ).reduce( ( carry, group ) => {
              if ( position.before && position.before === group.id ) {
                const gid = id || uniqid();
                carry[ gid ] = { ...groupDefaultState( gid ), ...options, commands: {}};
              }
              carry[ group.id ] = group;
              if ( position.after && position.after === group.id ) {
                const gid = id || uniqid();
                carry[ gid ] = { ...groupDefaultState( gid ), ...options, commands: {}};
              }
              return carry;
            }, {});

      return update( state, {
          $set: entities
      });
    },

    [ actions.swapStest ]: ( state, { payload }) => {
      const srcArr = Object.values( state ),
            source = { ...srcArr[ payload.sourceInx ] },
            resArr = update( srcArr, {
              $splice: [[ payload.sourceInx, 1 ], [ payload.targetInx, 0, source ]]
            });

      return update( state, {

            $set: resArr.reduce( ( carry, item ) => {
              carry[ item.id ] = item;
              return carry;
            }, {})

        });
    },

    /**
     * Update record
     * @param {object} state
     * @param {Entity} payload (EntityRef required)
     * @returns {object}
     */
    [ actions.updateStest ]: ( state, { payload }) => {

      return update( state, {


            $apply: ( ref ) => {
              const groups = { ...ref },
                    id = payload.id;
              groups[ id ] = { ...groups[ id ], ...payload, id, key: id };
              if ( !groups[ id ].hasOwnProperty( "commands" ) ) {
                groups[ id ].commands = {};
              }
              return groups;
            }

        });
    },

    /**
     * Remove record
     * @param {object} state
     * @param {EntityRef} payload
     * @returns {object}
     */
    [ actions.removeStest ]: ( state, { payload }) => update( state, {

          $unset:[ payload.id ]
      })

}


