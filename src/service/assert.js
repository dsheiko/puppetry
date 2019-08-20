import { RuntimeError } from "error";
import ExpressionParser from "service/ExpressionParser";

export function buildAssertionTpl( commandCall, command, comment ) {
  try {
    const cbBody = createCbBody( command );
    return justify( `${ comment }\nresult = ${ commandCall };` ) + ` ${ cbBody }`;
  } catch ( err ) {
    console.warn( "Renderer process: buildAssertionTpl error:", err, { commandCall, command, comment });
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

function parseTpl( value, id ) {
  const parser = new ExpressionParser( id );
  return parser.stringify( value );
}

function createCbBody({ assert, target, method, id }) {
  const { assertion, value, operator, position, ...options } = assert,
        source = `${ target }.${ method }`;
  
  switch ( assertion ) {
    case "screenshot":
      return justify( `expect( result ).toMatchScreenshot( ${ options.mismatchTolerance }, "${ source }" );` );
    case "selector":
      return justify( `expect( result ).toBeOk( "${ source }" );` );
    case "boolean":
      return justify( `expect( result )${ value ? "" : ".not" }.toBeOk( "${ source }" );` );
    case "number":
      return justify( `expect( result ).toPassCondition( "${ operator }", ${ value }, "${ source }" );` );
    case "contains":
      if ( typeof options.type !== "undefined" && options.type === "string" ) {
        return justify( `expect( result ).toIncludeSubstring( ${ parseTpl( value, id ) }, "${ source }" );` );
      }
      return justify( `expect( result ).toIncludeSubstring( "${ value }", "${ source }" );` );
    case "equals":
      if ( typeof options.type !== "undefined" && options.type === "string" ) {
        return justify( `expect( result ).toBeEqual( ${ parseTpl( value, id ) }, "${ source }" );` );
      }
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

