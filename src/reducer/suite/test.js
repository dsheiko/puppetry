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
 * @property {string} groupId
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
    [ actions.addTest ]: ( state, { payload }) => {
      const { options, id } = normalizeComplexPayload( payload ),
            merge = {},
            gid = id || uniqid();

      merge[ gid ] = { ...testDefaultState( gid ), ...options, commands: {}};

      return update( state, {

          groups: {
            [ options.groupId ]: {
              tests: {
                $merge: merge
              }
            }
          }
      });
    },

    /**
     * Insert record before/after
     * @param {object} state
     * @param {Payload} payload
     * @returns {object}
     */
    [ actions.insertAdjacentTest ]: ( state, { payload }) => {
      const { options, position, id } = normalizeComplexPayload( payload ),
            { tests }  = state.groups[ options.groupId ],

            entities = Object.values( tests ).reduce( ( carry, test ) => {
              if ( position.before && position.before === test.id ) {
                const gid = id || uniqid();
                carry[ gid ] = { ...testDefaultState( gid ), ...options, commands: {}};
              }
              carry[ test.id ] = test;
              if ( position.after && position.after === test.id ) {
                const gid = id || uniqid();
                carry[ gid ] = { ...testDefaultState( gid ), ...options, commands: {}};
              }
              return carry;
            }, {});

      return update( state, {

          groups: {
            [ options.groupId ]: {
              tests: {
                $set: entities
              }
            }
          }

      });
    },

    [ actions.swapTest ]: ( state, { payload }) => {
      const destGroupTests = Object.values( state.groups[ payload.groupId ].tests ),
            sourceTest = { ...destGroupTests[ payload.sourceInx ] },
            resArr = update( destGroupTests, {
              $splice: [[ payload.sourceInx, 1 ], [ payload.targetInx, 0, sourceTest ]]
            });

      // Moving between groups
      if ( !destGroupTests.find( test => test.id === payload.sourceId ) ) {
        const tests = getTestsFlat( state.groups ),
              srcTest = tests.find( test => test.id  === payload.sourceId ),
              targetTest = tests.find( test => test.id  === payload.targetId );
        return transferTest( state, srcTest, targetTest );
      }

      return update( state, {

          groups: {
            [ payload.groupId ]: {
              tests: {
                $set: resArr.reduce( ( carry, item ) => {
                  carry[ item.id ] = item;
                  return carry;
                }, {})
              }
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
    [ actions.updateTest ]: ( state, { payload }) => update( state, {

        groups: {
          [ payload.groupId ]: {
            tests: {
              $apply: ( ref ) => {
                const tests = { ...ref },
                      id = payload.id;
                tests[ id ] = { ...tests[ id ], ...payload, id, key: id };
                return tests;
              }
            }
          }
        }
      }),

    /**
     * Remove record
     * @param {object} state
     * @param {EntityRef} payload
     * @returns {object}
     */
    [ actions.removeTest ]: ( state, { payload }) => update( state, {

        groups: {
          [ payload.groupId ]: {
            tests: {
              $unset:[ payload.id ]
            }
          }
        }
      })

}


