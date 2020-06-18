import { remote, shell } from "electron";

export const isEveryValueMissing = ( obj ) => Object.values( obj ).every( val => typeof val === "undefined" );
export const isSomeValueMissing = ( obj ) => Object.values( obj ).some( val => typeof val === "undefined" );
export const isEveryValueNull = ( obj ) => Object.values( obj ).every( val => val === null );
export const isSomeValueNull = ( obj ) => Object.values( obj ).some( val => val === null );
export const isEveryValueFalsy = ( obj ) => Object.values( obj ).every( val => !val );

export const OPERATOR_MAP = {
  gt: ">",
  lt: "<",
  eq: "="
};

export const HAS_OPERATOR_MAP = {
  gt: "more than",
  lt: "less than",
  eq: ""
};

export function renderTarget( targetName ) {
  return `await bs.getTarget( "${ targetName }" )`;
}

export const SELECT_SEARCH_PROPS = {
  showSearch: true,
  optionFilterProp: "children",
  filterOption: ( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
};

export function extendToLabel( record, text ) {
  return record.waitForTarget ? `target.waitForTarget(), ` + text : text;
}

export function extendToGherkin( record, text ) {
  return record.waitForTarget ? `Wait for target \`${ record.target } \` and ` + lcfirst( text ) : text;
}

/**
 * Underscore: return object prop value or a given default one if not defined
 * @param {Object} obj
 * @param {String} key
 * @param {*} defaultVal
 * @returns {*}
 */
export function result( obj, key, defaultVal = null ) {
  if ( typeof obj !== "object" ) {
    return defaultVal;
  }
  return ( key in obj && typeof obj[ key ] !== "undefined" ) ? obj[ key ] : defaultVal;
}

/**
 *
 * @param {Object} obj
 * @param {String[]} keys
 * @returns {Object}
 */
export function filterObject( obj, keys ) {
  if ( typeof obj !== "object" ) {
    return {};
  }
  return keys.reduce( ( carry, key ) => {
    if ( key in obj && typeof obj[ key ] !== "undefined" ) {
      carry[ key ] = obj[ key ];
    }
    return carry;
  }, {});
}

export function normalizeAssertionValue( assert ) {
  return ( assert.assertion !== "hasAttribute" && assert.assertion !== "!hasAttribute"
    && assert.assertion !== "hasProperty" && assert.assertion !== "!hasProperty"
    && assert.assertion !== "empty" && assert.assertion !== "!empty" ) ? ` \`${ assert.value }\`` : ``;
}

export function normalizeAssertionVerb( verb ) {
  switch ( verb ) {
  case "hasAttribute":
    return "is present";
  case "!hasAttribute":
    return "is absent";
  case "hasProperty":
    return "is true";
  case "!hasProperty":
    return "is false";
  case "empty":
    return "is empty";
  case "!empty":
    return "is not empty";
  case "!equals":
    return "does not equal";
  case "!contains":
    return "does not contain";
  default:
    return verb;
  }
}

export function renderClick( params, pref = "" ) {
  const text = ( params.button ? `\`${ params.button  } button\`` : "" )
   + `${ parseInt( params.clickCount, 10 ) === 2 ? ", `double click`" : "" }`;
  return text ? pref + text : "";
}

export const ruleValidateVariable = ( rule, value, callback ) => {
  const reConst = /^[A-Z_0-9]+$/g;
  value = value.trim();
  if ( !value.length ) {
    return callback( "The value shall not be empty" );
  }
  if ( !value.match( reConst ) ) {
    return callback( "Shall be in all upper case with underscore separators" );
  }
  callback();
};

export const ruleValidateNotEmptyString = ( rule, value, callback ) => {
  value = value.trim();
  if ( !value.length ) {
    return callback( "The value shall not be empty" );
  }
  callback();
};

export const ruleValidateGenericString = ( rule, value, callback ) => {
  value = value.trim();
  if ( value.length < 3 ) {
    return callback( "The value shall not be less than 3 characters" );
  }
  if ( value.length > 250 ) {
    return callback( "The value shall not be more than 250 characters" );
  }
  callback();
};

export function pipePush( arr, item ) {
  arr.push( item );
  return arr;
}

export function sortStrings( a, b ) {
  const valA = a.toUpperCase(),
        valB = b.toUpperCase();
  if ( valA < valB ) {
    return -1;
  }
  if ( valA > valB ) {
    return 1;
  }
  return 0;
}

/**
 *
 * @param {Date} date
 * @returns {Number}
 */
export function dateToTs( date = new Date() ) {
  return Math.round( date.getTime() / 1000 );
}

export function tsToDateString( timestamp ) {
  const date = new Date( timestamp * 1000 ),
        month = "0" + date.getMonth(),
        day = "0" + date.getDate(),
        hours = date.getHours(),
        minutes = "0" + date.getMinutes(),
        seconds = "0" + date.getSeconds();

  return `${ date.getFullYear() }/${ month.substr( -2 ) }/${ day.substr( -2 ) }`
    + ` ${ hours }:${ minutes.substr( -2 ) }:${ seconds.substr( -2 ) }`;
}

export const onExtClick = ( e ) => {
  e.preventDefault();
  const el = e.target;
  shell.openExternal( el.href );
};

export const closeApp = () => {
  remote.getCurrentWindow().close();
};


export function millisecondsToStr( milliseconds ) {
  let temp = milliseconds / 1000;
  const years = Math.floor( temp / 31536000 ),
        days = Math.floor( ( temp %= 31536000 ) / 86400 ),
        hours = Math.floor( ( temp %= 86400 ) / 3600 ),
        minutes = Math.floor( ( temp %= 3600 ) / 60 ),
        seconds = temp % 60;

  if ( milliseconds > 1000 ) {
    return ( years ? years + "y " : "" ) +
      ( days ? days + "d " : "" ) +
      ( hours ? hours + "h " : ""  ) +
      ( minutes ? minutes + "m " : "" ) +
      Number.parseFloat( seconds ).toFixed( 2 ) + "s";
  }

  return milliseconds + "ms";
}

export function truncate( str, limit ) {
  str = ( "" + str ).trim();
  return ( str.length > limit ) ? str.substr( 0, limit - 3 ) + "..." : str;
}

export function ucfirst( s ) {
  if ( typeof s !== "string" ) {
    return "";
  }
  return s.charAt( 0 ).toUpperCase() + s.slice( 1 );
}

export function lcfirst( s ) {
  if ( typeof s !== "string" ) {
    return "";
  }
  return s.charAt( 0 ).toLowerCase() + s.slice( 1 );
}

