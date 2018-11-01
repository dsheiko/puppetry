/**
 * Invoke a given callback only after this function stops being called `wait` milliseconds
 * usage:
 * debounce( cb, 500 )( ..arg );
 *
 * or
 *
 * const once  = debounce( () => console.count("Hello"), 50, this );
 * once();
 * once();
 * once();
 *
 * @param {Function} cb
 * @param {Number} wait
 * @param {Object} context
 */
export default function debounce ( cb, wait, context = null ) {
  /**
  * @type {number}
  */
  var timer = null;
  return ( ...args ) => {
    clearTimeout( timer );
    timer = setTimeout( () => {
      timer = null;
      cb.apply( context || this, args );
    }, wait );
  };
}
