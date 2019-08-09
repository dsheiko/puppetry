const targets = {},
      cache = new Map(),
      normalizeVar = ( str ) => str.toUpperCase().replace( /[^A-Z0-9_]/g, "_" );

function clearTargets() {
  Object.keys( targets ).forEach( key => {
    delete targets[ key ];
  });
}

function makeVar( elRefObj ) {
  switch ( true ) {
    case Boolean( elRefObj.id ):
      // div#foo -> DIV_ID_FOO
      return normalizeVar( `${ elRefObj.tagName }_ID_${ elRefObj.id }` );
    case Boolean( elRefObj.name ):
      // input[name=BAR] -> INPUT_NAME_BAR
      return normalizeVar( `${ elRefObj.tagName }_NAME_${ elRefObj.name }` );
    case Boolean( elRefObj.className ):
      // div.foo.bar.baz -> DIV_CLASS_FOO_BAR_BAZ
      return normalizeVar( `${ elRefObj.tagName }_CLASS_${ elRefObj.className.split( " " ).join( "_" ) }` );
    default:
      return normalizeVar( `${ elRefObj.tagName }` );
  }
}

/**
 * @typedef RefObj
 * @property {?string} id
 * @property {?string} name
 * @property {?string} className
 * @property {string} tagName
 * @property {string} pid  - generated id
 * @property {string} query
 */

/**
 * @typedef TargetDto
 * @property {string} name
 * @property {boolean} isNew
 */

/**
 * @param {RefObj} elRefObj
 * @returns {TargetDto}
 */
function registerElement( elRefObj ) {
  if ( cache.has( elRefObj.pid ) ) {
    return {
      name: cache.get( elRefObj.pid ),
      isNew: false
    };
  }
  let v = makeVar( elRefObj );
  if ( v in targets ) {
    const count = Object.keys( targets ).filter( key => key.startsWith( v ) ).length;
    v = `${ v }_${ count }`;
  }
  targets[ v ] = elRefObj.query;
  cache.set( elRefObj.pid, v );
  return {
    name: v,
    isNew: true
  };
}


exports.clearTargets = clearTargets;
exports.targets = targets;
exports.registerElement = registerElement;
exports.makeVar = makeVar;