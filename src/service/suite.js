
export function findTargets( record ) {
  // group
  if ( "tests" in record ) {
    return Object.values( record.tests ).reduce(( carry, test ) => {
      return [ ...carry, ...findTargets( test ) ];
    }, []);
  }
  if ( "commands" in record ) {
    return Object.values( record.commands )
      .filter( c => c.target !== "page" )
      .map( c => c.target );
  }
  // command
  return record.target === "page" ? [] : [ record.target ];
}