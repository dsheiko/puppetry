import { ExpressionParserException } from "error";

function extractParams( func, directive ) {
  const body = directive.substr( func.length + 1 ).replace( /\)$/, "" );
  return JSON.parse( `[${ body }]` );
}

function createIife( code ) {
  return `(() => { ${ code } })()`;
}

class Parsers {

  constructor( vars ) {
    this.vars = vars;
  }

  // {{ faker("address.streetSuffix", "en") }}
  faker = ( directive ) => {
    try {
      const [ method, locale ] = extractParams( "faker", directive );
      return createIife( `faker.locale = "${ locale }"; return faker.${ method }();` );
    } catch ( err ) {
      throw new ExpressionParserException( `Cannot parse directive ${ directive }` );
    }
  };

  // {{ random(["aa", "bb"]) }}
  random= ( directive ) => {
    try {
      const [ json ] = extractParams( "random", directive );
      return createIife( `const json = ${ JSON.stringify( json ) }; return json[ randomInt( json.length  ) ];` );
    } catch ( err ) {
      throw new ExpressionParserException( `Cannot parse directive ${ directive }` );
    }
  }

  variable = ( key ) => {
    if ( !( key in this.vars ) ) {
      throw new ExpressionParserException( `Cannot find variable corresponding to key ${ key }` );
    }
    return this.vars[ key ];
  }
}

export default class ExpressionParser {

    constructor( vars ) {
      this.parsers = new Parsers( vars );
    }

    parse( value ) {
      const DIRECTIVE_RE = /\{\{(.+)\}\}/,
            VARIABLE_RE = /^[a-zA-Z0-9_]+$/,
            matches = value.match( DIRECTIVE_RE );

      if ( matches === null ) {
        return value;
      }

      const directive = matches[ 1 ].trim();
      if ( VARIABLE_RE.test( directive ) ) {
        return this.parsers.variable( directive );
      }

      const parser = Object.getOwnPropertyNames( this.parsers ).find( ( available ) => directive.startsWith( available + "(" ) );
      if ( !parser ) {
        throw new ExpressionParserException( `Cannot parse directive ${ directive }` );
      }
      return this.parsers[ parser ]( directive );
    }

    buildFakerDirective( method, locale ) {
      return `{{ faker( "${ method }", "${ locale}" ) }}`;
    }
}