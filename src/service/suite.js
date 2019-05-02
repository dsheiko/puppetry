
export function findTargets( record ) {
  // group
  if ( "tests" in record ) {
    const targets = Object.values( record.tests ).reduce(( carry, test ) => {
      return [ ...carry, ...findTargets( test ) ];
    }, []);
    return [ ...new Set( targets ) ];
  }
  if ( "commands" in record ) {
    const targets = Object.values( record.commands )
      .filter( c => c.target !== "page" )
      .reduce(( carry, command ) => {
        return [ ...carry, ...findTargets( command ) ];
      }, []);
    return [ ...new Set( targets ) ];
  }
  // command
  if ( record.target === "page" ) {
    return [];
  }
  if ( "target" in record.assert ) {
    return [ ...new Set([ record.target, record.assert.target ]) ];
  }
  return [ record.target ];
}