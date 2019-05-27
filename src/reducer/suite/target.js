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

   // insert after/before
   // payload{ options, position }
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

   [ actions.removeTarget ]: ( state, { payload }) => update( state, {
       targets: {
         $unset:[ payload.id ]
       }
     }),

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
   }

}


