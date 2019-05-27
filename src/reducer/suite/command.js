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



    [ actions.addCommand ]: ( state, { payload }) => update( state, {

        groups: {
          [ payload.groupId ]: {
            tests: {
              [ payload.testId ]: {
                commands: {
                  $apply: ( ref ) => {
                    const commands = { ...ref },
                          id = uniqid(),
                          defaultState = commandDefaultState( id );
                    commands[ id ] = {
                      ...defaultState,
                      ...normalizePayload( payload )
                    };
                    return commands;
                  }
                }
              }
            }
          }
        }
      }),


    // insert after/before
    // payload{ options, position }
    [ actions.insertAdjacentCommand ]: ( state, { payload }) => {
      const { options, position } = normalizeComplexPayload( payload ),
            { commands }  = state.groups[ options.groupId ].tests[ options.testId ],

            entities = Object.values( commands ).reduce( ( carry, command ) => {
              if ( position.before && position.before === command.id ) {
                const id = uniqid();
                carry[ id ] = { ...commandDefaultState( id ), ...options };
              }
              carry[ command.id ] = command;
              if ( position.after && position.after === command.id ) {
                const id = uniqid();
                carry[ id ] = { ...commandDefaultState( id ), ...options };
              }
              return carry;
            }, {});


      return update( state, {

          groups: {
            [ options.groupId ]: {
              tests: {
                [ options.testId ]: {
                  commands: {
                    $set: entities
                  }
                }
              }
            }
          }
      });
    },

    [ actions.swapCommand ]: ( state, { payload }) => {
      const srcArr = Object.values( state.groups[ payload.groupId ].tests[ payload.testId ].commands ),
            source = { ...srcArr[ payload.sourceInx ] },
            resArr = update( srcArr, {
              $splice: [[ payload.sourceInx, 1 ], [ payload.targetInx, 0, source ]]
            });


      // Moving between tests/groups
      if ( !srcArr.find( command => command.id === payload.sourceId ) ) {
        const commands = getCommandsFlat( state.groups ),
              sourceCommand = commands.find( command => command.id  === payload.sourceId ),
              targetCommand = commands.find( command => command.id  === payload.targetId );
        return transferCommand( state, sourceCommand, targetCommand );
      }

      return update( state, {

          groups: {
            [ payload.groupId ]: {
              tests: {
                [ payload.testId ]: {
                  commands: {
                    $set: resArr.reduce( ( carry, item ) => {
                      carry[ item.id ] = item;
                      return carry;
                    }, {})
                  }
                }
              }
            }
          }
        });
    },

    [ actions.updateCommand ]: ( state, { payload }) => update( state, {

        groups: {
          [ payload.groupId ]: {
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
          }
        }
      }),

    [ actions.removeCommand ]: ( state, { payload }) => update( state, {

        groups: {
          [ payload.groupId ]: {
            tests: {
              [ payload.testId ]: {
                commands: {
                  $unset:[ payload.id ]
                }
              }
            }
          }
        }
      })


}


