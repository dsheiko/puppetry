/**
 * Adds/removes args in the launcher args string
 * @param {String} launcherArgs
 * @param {String} value
 * @param {Boolean} toggle
 * @returns {String}
 */
export function updateLauncherArgs( launcherArgs, value, toggle ) {
  const args = launcherArgs.split( " " )
    .filter( arg => arg.trim().length )
    .filter( arg => !arg.startsWith( value ) );

  if ( toggle ) {
    args.push( value );
  }

  return args.join( " " );
}