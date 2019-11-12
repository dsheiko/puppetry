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
  if ( typeof record.assert === "object" && "target" in record.assert ) {
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

export function migrateAssertVisible( command ) {
  // Puppetry 2.x to 3.x
  if ( command.method === "assertVisible" && command.assert.assertion === "boolean" ) {
    return {
      ...command,
      assert: {
        "assertion": "visible",
        "availability": command.assert.value ? "visible" : "invisible",
        "display": "any",
        "visibility": "any",
        "opacity": "any",
        "isIntersecting": "any"
      }
    };
  }
  // Puppetry 3 RC1 to 3.x
  if ( command.method === "assertVisible" && typeof command.assert.value !== "undefined" ) {
    return {
      ...command,
      assert: {
        "assertion": "visible",
        "availability": command.assert.value ? "available" : "unavailable",
        "display": command.assert.display,
        "visibility": command.assert.visibility,
        "opacity": command.assert.visibility.opacity,
        "isIntersecting": command.assert.isIntersecting ? "true" : "false"
      }
    };
  }
  return command;
}