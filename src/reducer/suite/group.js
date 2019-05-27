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


    // insert after/before
    // payload{ options, position }
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

    [ actions.updateGroup ]: ( state, { payload }) => {

      return update( state, {

          groups: {
            $apply: ( ref ) => {
              const groups = { ...ref },
                    id = payload.id;

              groups[ id ] = { ...groups[ id ], ...payload, id, key: id };
              return groups;
            }
          }
        });
    },

    [ actions.removeGroup ]: ( state, { payload }) => update( state, {

        groups: {
          $unset:[ payload.id ]
        }
      })

}


