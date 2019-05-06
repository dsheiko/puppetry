const chokidar = require( "chokidar" ),
      log = require( "electron-log" ),
      debounce = require( "lodash.debounce" ),
      { E_FILE_NAVIGATOR_UPDATED } = require( "../constant" );

let watcher;

const notifyRenderer = debounce(( action, event, path ) => {
  return event.sender.send( E_FILE_NAVIGATOR_UPDATED, path,  action );
}, 100 );

module.exports = ( event, path ) => {
    // If repeating call, remove existing listeners from files
    watcher && watcher.close();

    watcher = chokidar.watch( "*.json", {
      depth: 1,
      cwd: path,
      alwaysStat: false,
      persistent: true,
      usePolling: true,
      interval: 300,
      ignored: ".puppetryrc"
    });

    watcher
      .on( "add", () => notifyRenderer( "add", event, path ) )
      .on( "addDir", () => () => notifyRenderer( "addDir", event, path ) )
      .on( "change", () =>  notifyRenderer( "change", event, path ) )
      .on( "unlink", () =>  notifyRenderer( "unlink", event, path ) )
      .on( "unlinkDir", () =>  notifyRenderer( "unlinkDir", event, path ) )
      .on( "error", ( error ) => {
        log.error( `Main process: chokidar: ${ error }` );
      });

};