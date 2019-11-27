let counterCache = new Set(), counter = 0;
/**
 * the logic is that complex because
 * ParamsFormBuilder re-renders with onChange event and simple counter
 * would iterate every time
 * @param {string} id
 * @returns {Number}
 */
export function getCounter( id ) {
  if ( counterCache.has( id ) ) {
    return counter;
  }
  counterCache.add( id );
  counter++;
  return counter;
}