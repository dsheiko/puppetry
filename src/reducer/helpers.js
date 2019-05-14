import update from "immutability-helper";
import { findTargetNodes } from "../service/suite";


function getTargetById( state, id ) {
  return state.suite.targets[ id ];
}

export function updateTagetsInSuite( prevState, nextState, targetId ) {
  const prevTarget = getTargetById( prevState, targetId ),
        nextTarget = getTargetById( nextState, targetId );

  if ( !prevTarget || !nextTarget ) {
    return nextState;
  }
  const prevTargetName = prevTarget.target,
        nextTargetName = nextTarget.target;

  if ( prevTargetName === nextTargetName ) {
    return nextState;
  }

  const targets = findTargetNodes( nextState.suite, prevTargetName );

  if ( !targets.length ) {
    return nextState;
  }

  let state = nextState;
  targets.forEach( target => {
    state = update( state, {
      suite: {
        groups: {
          [ target.groupId ]: {
            tests: {
              [ target.testId ]: {
                commands: {
                  [ target.id ]: {
                    $apply: ({ ...command }) => {
                      command.target = command.target === prevTargetName ? nextTargetName : command.target;
                      if ( "assert" in command
                            && "target" in command.assert
                            && command.assert.target === prevTargetName  ) {
                        return update( command, {
                          assert: {
                            target: {
                              $set: nextTargetName
                            }
                          }
                        });
                      }
                      return command;
                    }
                  }
                }
              }
            }
          }
        }
      }});
  });
  return state;
}

export function isTargetNotUnique( state, payload ) {
  return Boolean( Object.values( state.suite.targets )
    .filter( item => item.id !== payload.id )
    .find( item => item.target === payload.target ) );
}

export function getCommandsFlat( groups ) {
  return Object.values( groups ).reduce( ( carry, group ) => {
    const commands = Object.values( group.tests ).reduce( ( carry, test ) => {
      return carry.concat( Object.values( test.commands ) );
    }, []);
    return carry.concat( commands );
  }, []);
}

export function getTestsFlat( groups ) {
  return Object.values( groups ).reduce( ( carry, group ) => {
    return carry.concat( Object.values( group.tests ) );
  }, []);
}

function arrayToMap( array ) {

  return array.reduce( ( carry, entry ) => {
    carry[ entry.id ] = { ...entry };
    return carry;
  }, {});
}

export function removeMapEntry( map, id ) {
  return arrayToMap( Object.values( map ).filter( entry => entry.id !== id ) );
}

export function appendMapEntry( map, targetEntry ) {
  return arrayToMap([ targetEntry, ...Object.values( map ) ]);
}

export function transferTest( state, sourceTest, targetTest ) {

  return update( state, {
    suite: {
      groups: {
        // remove
        [ sourceTest.groupId ]: {
          tests: {
            $set: removeMapEntry( state.suite.groups[ sourceTest.groupId ].tests, sourceTest.id )
          }
        },
        // add
        [ targetTest.groupId ]: {
          tests: {
            $set: appendMapEntry( state.suite.groups[ targetTest.groupId ].tests, sourceTest )
          }
        }
      }
    }});
}

export function transferCommand( state, sourceCommand, targetCommand ) {
  const sourceCommands = state.suite.groups[ sourceCommand.groupId ].tests[ sourceCommand.testId ].commands,
        targetCommands = state.suite.groups[ targetCommand.groupId ].tests[ targetCommand.testId ].commands,

        temp = update( state, {
          suite: {
            groups: {
              // remove
              [ sourceCommand.groupId ]: {
                tests: {
                  [ sourceCommand.testId ]: {
                    commands: {
                      $set: removeMapEntry( sourceCommands, sourceCommand.id )
                    }
                  }
                }
              }
            }
          }});

  return update( temp, {
    suite: {
      groups: {
        // add
        [ targetCommand.groupId ]: {
          tests: {
            [ targetCommand.testId ]: {
              commands: {
                $set: appendMapEntry( targetCommands, sourceCommand )
              }
            }
          }
        }
      }
    }});
}

export const normalizeComplexPayload = ( payload ) => {
  if ( "id" in  payload.options ) {
    delete payload.options.id;
  }
  if ( "key" in  payload.options ) {
    delete payload.options.key;
  }
  return payload;
};

export const normalizePayload = ( payload ) => {
  if ( "id" in  payload ) {
    delete payload.id;
  }
  if ( "key" in  payload ) {
    delete payload.key;
  }
  return payload;
};