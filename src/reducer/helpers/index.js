import update from "immutability-helper";
import { findTargetNodes } from "service/suite";


function getTargetById( state, id ) {
  return state.targets[ id ];
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

  const targets = findTargetNodes( nextState, prevTargetName );

  if ( !targets.length ) {
    return nextState;
  }

  let state = nextState;
  targets.forEach( target => {
    state = update( state, {

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
      });
  });
  return state;
}

export function isTargetNotUnique( state, payload ) {
  return Boolean( Object.values( state.targets )
    .filter( item => item.id !== payload.id )
    .find( item => item.target === payload.target ) );
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