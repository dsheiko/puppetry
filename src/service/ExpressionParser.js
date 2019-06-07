import { ExpressionParserException } from "error";
import faker from "faker";

function extractParams( func, directive ) {
  const body = directive.substr( func.length + 1 ).replace( /\)$/, "" );
  return JSON.parse( `[${ body }]` );
}

const randomInt = ( max ) => Math.floor( Math.random() * Math.floor( max ) );

function fake( path, locale ) {
  const [ ns, method ] = path.split( "." );
  faker.locale = locale;
  return faker[ ns ][ method ]();
}

class NodeStorage {
  data = new Map();
  get = ( sid ) => this.data.has( sid ) ? parseInt( this.data.get( sid ), 10 ) : 0;
  set = ( sid, val ) => this.data.set( sid, val );
}

class WebStorage {
  get = ( sid ) => localStorage.hasItem( sid ) ? parseInt( localStorage.getItem( sid ), 10 ) : 0;
  set = ( sid, val ) => localStorage.setItem( sid, val );
}

class Parsers {

  constructor( commandId ) {
    this.commandId = commandId;
    this.storage = typeof localStorage === "undefined" ? new NodeStorage : new WebStorage;
  }

  // {{ faker("address.streetSuffix", "en") }}
  faker = ([ method, locale ]) => fake( method, locale || "en_GB" );

  // {{ random(["aa", "bb"]) }}
  random = ([ json ]) => json[ randomInt( json.length  ) ];

  // {{ counter() }}
  counter = () => {
    const sid = `counter_${ this.commandId }`,
          val = this.storage.get( sid ) + 1;
    this.storage.set( sid, val );
    return `${ val }`;
  }

  // {{ iterate(["aa", "bb"]) }}
  iterate = ([ json ]) => {
    const sid = `iterate_${ this.commandId }`,
          inx = this.storage.get( sid );
    this.storage.set( sid, ( inx + 1 ) >= json.length ? 0 : inx + 1 );
    return `${ json[ inx ] }`;
  }

  // {{ env("SECRET") }}
  env = ([ key ]) => `process.env.${ key }`;

  // {{ FOO }}
  variable = ( key ) => `ENV[ "${ key }" ]`;
}

export default class ExpressionParser {

  constructor( commandId = "" ) {
    this.parsers = new Parsers( commandId );
  }

  stringify( value ) {
    const EXP_RE = /\{\{([^\}]+)\}\}/gm;
    // no expression for sure
    if ( !value.includes( "{{" ) ) {
      return JSON.stringify( value );
    }
    const matches = value.match( EXP_RE );
    if ( !matches ) {
      return JSON.stringify( value );
    }
    matches
      .forEach( exp => {
        const chunk = this.parseExp( exp );
        value = value.replace( exp, "${ " + chunk + " }" );
      });
    return `\`${ value }\``;
  }

  parseExp( rawExp ) {
    const VARIABLE_RE = /^[a-zA-Z0-9_\.]+$/,
          // transform {{FOO}} to FOO
          exp = rawExp.substr( 2 ).slice( 0, -2 ).trim();

    if ( VARIABLE_RE.test( exp ) ) {
      return this.parsers.variable( exp );
    }

    // check if any of available methods matches the expresion
    const parser = Object.getOwnPropertyNames( this.parsers )
      .find( ( available ) => exp.startsWith( available + "(" ) );
    if ( !parser ) {
      throw new ExpressionParserException( `Cannot parse expression ${ exp }` );
    }
    try {
      return this.parsers[ parser ]( extractParams( parser, exp ) );
     } catch ( err ) {
       console.log(err);
      throw new ExpressionParserException( `Cannot parse directive ${ exp }` );
    }
  }

  buildFakerDirective( method, locale ) {
    return `{{ faker( "${ method }", "${ locale}" ) }}`;
  }
}