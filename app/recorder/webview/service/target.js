const targets = {},
      cache = new Map(),
      xpath = require( "simple-xpath-position" ),
      normalizeVar = ( str ) => str.toUpperCase().replace( /[^A-Z0-9_]/g, "_" );

function clearTargets() {
  Object.keys( targets ).forEach( key => {
    delete targets[ key ];
  });
}

function makeVar( el ) {
  switch ( true ) {
    case Boolean( el.id ):
      // div#foo -> DIV_ID_FOO
      return normalizeVar( `${ el.tagName }_ID_${ el.id }` );
    case Boolean( el.name ):
      // input[name=BAR] -> INPUT_NAME_BAR
      return normalizeVar( `${ el.tagName }_NAME_${ el.name }` );
    case Boolean( el.className ):
      // div.foo.bar.baz -> DIV_CLASS_FOO_BAR_BAZ
      return normalizeVar( `${ el.tagName }_CLASS_${ el.className.split( " " ).join( "_" ) }` );
    default:
      return normalizeVar( `${ el.tagName }` );
  }
}

function register( el, query ) {
  let v = makeVar( el );
  if ( v in targets ) {
    const count = Object.keys( targets ).filter( key => key.startsWith( v ) ).length;
    v = `${ v }_${ count }`;
  }
  targets[ v ] = query;
  cache.set( el, v );
  return v;
}

function getQuery( el ) {
  if ( el.id && document.querySelectorAll( `#${ el.id }` ).length === 1 ) {
    return `#${ el.id }`;
  }
  if ( el.name && document.querySelectorAll( `${ el.tagName }[name="${ el.name }"]` ).length === 1 ) {
    return `${ el.tagName }[name="${ el.name }"]`;
  }
  return xpath.fromNode( el );
}

function getTargetVar( el ) {
  if ( cache.has( el ) ) {
    return cache.get( el );
  }
  const query = getQuery( el );
  return register( el, query );
}


exports.clearTargets = clearTargets;
exports.targets = targets;
exports.getTargetVar = getTargetVar;