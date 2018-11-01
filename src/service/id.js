function toNum( str ) {
  return String( str )
    .trim()
    .split( "_" )
    .pop();
}

export function genId( gInx, tInx = null, cInx = null ) {
  return `_${toNum( gInx )}` +
   ( tInx === null ? "" : `_${toNum( tInx )}` ) +
   ( cInx === null ? "" : `_${toNum( cInx )}` );
}

export function getTestId( id ) {
  const [ gId, tId ] = id.split( "_" ).slice( 1 );
  return `_${gId}_${tId}`;
}

export function getGroupId( id ) {
  const [ gId ] = id.split( "_" ).slice( 1 );
  return `_${gId}`;
}