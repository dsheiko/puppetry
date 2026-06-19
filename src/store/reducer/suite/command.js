import uniqid from "uniqid";
import actions from "store/action";
import update from "immutability-helper";
import {
  normalizeComplexPayload,
  normalizePayload
} from "store/reducer/helpers";

import { commandDefaultState } from "store/reducer/defaultState";

export default {

  [ actions.addCommand ]: ( state, { payload }) => {
    const { options, id } = normalizeComplexPayload( payload ),
          uid = id || uniqid();
    return update( state, {
      modified: {
        $set: true
      },
      tests: {
        [ options.testId ]: {
          commands: {
            $apply: ( ref ) => {
              const commands = { ...ref },
                    defaultState = commandDefaultState( uid );
              commands[ uid ] = {
                ...defaultState,
                ...normalizePayload( options )
              };
              return commands;
            }
          }
        }
      }
    });
  },

  [ actions.insertAdjacentCommand ]: ( state, { payload }) => {
    const { options, position, id } = normalizeComplexPayload( payload ),
          { commands } = state.tests[ options.testId ],

          entities = Object.values( commands ).reduce( ( carry, command ) => {
            if ( position.before && position.before === command.id ) {
              const uid = id || uniqid();
              carry[ uid ] = { ...commandDefaultState( uid ), ...options };
            }
            carry[ command.id ] = command;
            if ( position.after && position.after === command.id ) {
              const uid = id || uniqid();
              carry[ uid ] = { ...commandDefaultState( uid ), ...options };
            }
            return carry;
          }, {});

    return update( state, {
      modified: {
        $set: true
      },
      tests: {
        [ options.testId ]: {
          commands: {
            $set: entities
          }
        }
      }
    });
  },

  [ actions.updateCommand ]: ( state, { payload }) => {
    if ( !state.tests.hasOwnProperty( payload.testId ) ) {
      return console.error( `actions.updateCommand: Cannot find test ${ payload.testId }` );
    }
    return update( state, {
      modified: {
        $set: true
      },
      tests: {
        [ payload.testId ]: {
          commands: {
            $apply: ( ref ) => {
              const commands = { ...ref },
                    id = payload.id;
              commands[ id ] = { ...commands[ id ], ...payload, key: id };
              return commands;
            }
          }
        }
      }
    });
  },

  [ actions.removeCommand ]: ( state, { payload }) => update( state, {
    modified: {
      $set: true
    },
    tests: {
      [ payload.testId ]: {
        commands: {
          $unset:[ payload.id ]
        }
      }
    }
  })

};
