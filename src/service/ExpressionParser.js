import { ExpressionParserException } from "error";
/*eslint no-useless-escape: 0*/

function extractParams( func, directive ) {
  const body = directive.substr( func.length + 1 ).replace( /\)$/, "" );
  return JSON.parse( `[${ body }]` );
}

const jstr = ( val ) => JSON.stringify( val );

class Parsers {

  constructor( commandId ) {
    this.commandId = commandId;
  }

  // {{ faker("address.streetSuffix", "en") }}
  faker = ([ method, locale = "en" ]) =>
    `util.exp.fake( ${ jstr( method ) }, ${ jstr( locale === "undefined" ? "en" : locale ) } )`;

  // {{ random(["aa", "bb"]) }}
  random = ([ json ]) => `util.exp.random( ${ jstr( json ) } )`;

  // {{ counter() }}
  counter = function(){
    return `util.exp.counter( ${ jstr( this.commandId ) } )`;
  }

  // {{ iterate(["aa", "bb"]) }}
  iterate = function([ json ]) {
    return `util.exp.iterate( ${ jstr( json  ) }, ${ jstr( this.commandId ) } )`;
  };

  // {{ htmlOf("FOO") }}
  htmlOf = ([ target ]) => `await bs.target( await ${ target }() ).getProp( "innerHTML" )`;

  // {{ attributeOf("FOO", "href") }}
  attributeOf = ([ target, attr ]) => `await bs.target( await ${ target }() ).getAttr( ${ JSON.stringify( attr ) } )`;

  // {{ propertyOf("FOO", "checked") }}
  propertyOf = ([ target, prop ]) => `await bs.target( await ${ target }() ).getProp( ${ JSON.stringify( prop ) } )`;

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
      console.warn( `Cannot parse expression ${ exp }. Expected syntax {{ method(..) }}` );
      return `\`${ rawExp }\``;
    }
    try {
      return this.parsers[ parser ]( extractParams( parser, exp ) );
    } catch ( err ) {
      throw new ExpressionParserException( `Cannot parse expression ${ exp }` );
    }
  }

  buildFakerDirective( method, locale ) {
    return `{{ faker( "${ method }", "${ locale}" ) }}`;
  }
}