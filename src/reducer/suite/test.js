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

export default {


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

    // insert after/before
    // payload{ options, position }
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


