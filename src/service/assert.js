import { RuntimeError } from "error";
import ExpressionParser from "service/ExpressionParser";

export function buildAssertionTpl( assertionCall, command, preCode ) {
  try {
    const cbBody = createCbBody( command );
    if ( command.method === "assertConsoleMessage" ) {
      return templateConsoleMessageAssertion( cbBody, command.assert, preCode );
    }
    if ( command.method === "assertDialog" ) {
      return templateDialogAssertion( cbBody, command.assert, command.params, preCode );
    }
    return justify( `${ preCode }\nresult = ${ assertionCall };` ) + ` ${ cbBody }`;
  } catch ( err ) {
    console.warn( "Renderer process: buildAssertionTpl error:", err, { assertionCall, command, preCode });
    throw err;
  }
}

function templateConsoleMessageAssertion( cbBody, assert, comment ) {
  return justify(`
${ comment }
consoleLog.forEach( msg => {
  let result = msg.text();
  if ( "${ assert.type }" === "any" || msg.type() === "${ assert.type }" ) {${ cbBody }
  }
});
  `);
}

function templateDialogAssertion( cbBody, assert, params, comment ) {
  return justify(`
${ comment }
toHaveSubstring

dialogLog.forEach( msg => {
  let result = msg;
  if ( "${ assert.type }" === "any" || msg.type() === "${ assert.type }" ) {${ cbBody }
  }
});
  `);
}

/**
 * Some assertions allow you to enable/disable params
 * In such case options._enabled map has information about what of params are enabled
 * { key1: boolean }
 *
 * @param {Object} options
 * @returns {Object}
 */
function getEnabledOptions( options ) {
  return Object.entries( options._enabled )
    .filter( pair => Boolean( pair[ 1 ] ) )
    .reduce(( carry, pair ) => {
      const key = pair[ 0 ];
      carry[ key ] = options[ key ];
      return carry;
    }, {});
}

/**
 *
 * @param {String} text
 * @returns {String}
 */
export function justify( text ) {
  return ( "\n" + text ).split( "\n" ).map( line => "      " + line ).join( "\n" );
}

function parseTpl( value, id, type = "string" ) {
  if ( typeof type === "undefined" || type !== "string" ) {
     return JSON.stringify( value );
  }
  const parser = new ExpressionParser( id );
  return parser.stringify( value );
}

function negate( not ) {
  // can be boolean, but now we have in AssertConsoleMessage "true"/"false"
  return ( not === "false" || !not ) ? `` : `.not`;
}

function createCbBody({ assert, target, method, id }) {
  const { assertion, value, operator, position, not, ...options } = assert,
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
      return justify( `expect( result ).toIncludeSubstring( ${ parseTpl( value, id, options.type ) }`
        + `, "${ source }" );` );
    case "!contains":
      return justify( `expect( result ).not.toIncludeSubstring( ${ parseTpl( value, id, options.type ) }`
        + `, "${ source }" );` );
    case "equals":
      return justify( `expect( result ).toBeEqual( ${ parseTpl( value, id, options.type ) }, "${ source }" );` );
    case "!equals":
      return justify( `expect( result ).not.toBeEqual( ${ parseTpl( value, id, options.type ) }, "${ source }" );` );

    case "haveString":
      return justify( `expect( result )${ negate( not ) }.toHaveString( ${ parseTpl( value, id, options.type ) }`
        + `, "${ source }" );` );
    case "haveSubstring":
      return justify( `expect( result )${ negate( not ) }.toHaveString( ${ parseTpl( value, id, options.type ) }`
        + `, "${ source }" );` );

    case "position":
      return justify( `expect( result ).toMatchPosition`
          + `( "${ position }", "${ target }", "${ options.target }", "${ source }" );` );
    case "boundingBox":
      return justify( `expect( result )`
          + `.toMatchBoundingBoxSnapshot( ${ JSON.stringify( options, null, "  " ) }, "${ source }" );` );

    case "assertAssetWeight":
      return resolveAssetAssertion( "toMatchAssetWeight", options, source );
    case "assertAssetCount":
      return resolveAssetAssertion( "toMatchAssetCount", options, source );
    case "assertGaTracking":
      return justify( `expect( result )`
          + `.toMatchGaTracking( ${ JSON.stringify( options, null, "  " ) }, "${ source }" );` );
    default:
      throw RuntimeError( `Invalid assertion '${ assertion }'` );
  }

}

function resolveAssetAssertion( assertionMethod, options, source ) {
  const data = getEnabledOptions( options );
  return Object.entries( data ).reduce(( carry, pair ) => {
    const type = JSON.stringify( pair[ 0 ] ),
          rawVal = parseInt( pair[ 1 ], 10 ),
          val = ( rawVal === NaN ? 0 : rawVal );
    carry += justify( `expect( result ).${ assertionMethod }( `
      + `${ type }, ${ ( val * 1000 ) }, "${ source }" ); ` );
    return carry;
  }, "" );
}

