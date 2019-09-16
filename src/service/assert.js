import { RuntimeError } from "error";
import ExpressionParser from "service/ExpressionParser";

export function buildAssertionTpl( commandCall, command, comment ) {
  try {
    const cbBody = createCbBody( command );
    if ( command.method === "assertConsoleMessage" ) {
      return templateConsoleMessageAssertion( cbBody, command.assert, comment );
    }
    if ( command.method === "assertDialog" ) {
      return templateDialogAssertion( cbBody, command.assert, command.params, comment );
    }
    return justify( `${ comment }\nresult = ${ commandCall };` ) + ` ${ cbBody }`;
  } catch ( err ) {
    console.warn( "Renderer process: buildAssertionTpl error:", err, { commandCall, command, comment });
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
dialogLog.forEach( msg => {
  let result = msg;
  if ( "${ assert.type }" === "any" || msg.type() === "${ assert.type }" ) {${ cbBody }
  }
});
  `);
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
      return justify( `expect( result ).toIncludeSubstring( ${ parseTpl( value, id, options.type ) }`
        + `, "${ source }" );` );
    case "equals":
      return justify( `expect( result ).toBeEqual( ${ parseTpl( value, id, options.type ) }, "${ source }" );` );

   case "not.contains":
      return justify( `expect( result ).not.toIncludeSubstring( ${ parseTpl( value, id, options.type ) }`
        + `, "${ source }" );` );
    case "not.equals":
      return justify( `expect( result ).not.toBeEqual( ${ parseTpl( value, id, options.type ) }, "${ source }" );` );

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

