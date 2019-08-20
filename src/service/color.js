function componentToHex( c ) {
  const hex = c.toString( 16 );
  return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex( r, g, b ) {
  return "#" + componentToHex( r ) + componentToHex( g ) + componentToHex( b );
}

export function hexToRgb( hex ) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
  return result ? [
    parseInt( result[ 1 ], 16 ),
    parseInt( result[ 2 ], 16 ),
    parseInt( result[ 3 ], 16 )
  ] : null;
}