import { RuntimeError } from "error";

export function buildAssertionTpl( commandCall, command, comment ) {
  try {
    const cbBody = createCbBody( command );
    return justify( `${ comment }\nresult = ${ commandCall };` ) + ` ${ cbBody }`;
  } catch ( err ) {
    console.warn( "buildAssertionTpl error:", err, { commandCall, command, comment });
    throw err;
  }
}

/**
 *
 * @param {String} text
 * @returns {String}
 */
export function justify( text ) {
  return ( "\n" + text ).split( "\n" ).map( line => "      " + line ).join( "\n" );
}

function createCbBody({ assert, target, method }) {
  const { assertion, value, operator, position, ...options } = assert,
        source = `${ target }.${ method }`;
  switch ( assertion ) {
  case "selector":
    return justify( `expect( result ).toBeOk( "${ source }" );` );
  case "boolean":
    return justify( `expect( result )${ value ? "" : ".not" }.toBeOk( "${ source }" );` );
  case "number":
    return justify( `expect( result ).toPassCondition( "${ operator }", ${ value }, "${ source }" );` );
  case "contains":
    return justify( `expect( result ).toIncludeSubstring( "${ value }", "${ source }" );` );
  case "equals":
    return justify( `expect( result ).toBeEqual( ${ JSON.stringify( value ) }, "${ source }" );` );
  case "position":
    return justify( `expect( result ).toMatchPosition`
        + `( "${ position }", "${ target }", "${ options.target }", "${ source }" );` );
  case "boundingBox":
    return justify( `expect( result )`
        + `.toMatchBoundingBoxSnapshot( ${ JSON.stringify( options, null, "  " ) }, "${ source }" );` );
  default:
    throw RuntimeError( `Invalid assertion '${ assertion }'` );
  }

}

