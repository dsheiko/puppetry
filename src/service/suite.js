/**
 *
 * @param {Object} record
 * @returns {Object[]}
 */
export function findTargets( record ) {
  // group
  if ( "tests" in record ) {
    const targets = Object.values( record.tests ).reduce( ( carry, test ) => {
      return [ ...carry, ...findTargets( test ) ];
    }, []);
    return [ ...new Set( targets ) ];
  }
  if ( "commands" in record ) {
    const targets = Object.values( record.commands )
      .filter( c => c.target !== "page" )
      .reduce( ( carry, command ) => {
        return [ ...carry, ...findTargets( command ) ];
      }, []);
    return [ ...new Set( targets ) ];
  }
  // command
  if ( record.target === "page" ) {
    return [];
  }
  if ( "assert" in record && "target" in record.assert ) {
    return [ ...new Set([ record.target, record.assert.target ]) ];
  }
  return [ record.target ];
}

function getCommandCoors( record ) {
  return {
    testId: record.testId,
    groupId: record.groupId,
    id: record.id
  };
}

export function findTargetNodes( record, target ) {
  // suite
  if ( "groups" in record ) {
    return Object.values( record.groups ).reduce( ( carry, group ) => {
      return [ ...carry, ...findTargetNodes( group, target ) ];
    }, []);
  }
  // group
  if ( "tests" in record ) {
    return Object.values( record.tests ).reduce( ( carry, test ) => {
      return [ ...carry, ...findTargetNodes( test, target ) ];
    }, []);
  }
  if ( "commands" in record ) {
    return Object.values( record.commands )
      .filter( c => c.target === target
        || hasTargetInAssert( c, target ) )
      .reduce( ( carry, command ) => {
        return [ ...carry, getCommandCoors( command ) ];
      }, []);
  }
}

function hasTargetInAssert( command, target ) {
  return "assert" in command
    && typeof command.assert === "object"
    && "target" in command.assert
    && command.assert.target === target;
}