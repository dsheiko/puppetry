const chokidar = require( "chokidar" ),
      log = require( "electron-log" ),
      { E_FILE_NAVIGATOR_UPDATED } = require( "../constant" );

let watcher;

module.exports = ( event, path ) => {
    // If repeating call, remove existing listeners from files
    watcher && watcher.close();

    watcher = chokidar.watch( "*.json", {
      depth: 1,
      cwd: path,
      alwaysStat: false,
      persistent: true,
      usePolling: true,
      interval: 100,
      ignored: ".puppetryrc"
    });

    watcher
      .on( "add", () => {
        event.sender.send( E_FILE_NAVIGATOR_UPDATED, path,  "add" );
      })
      .on( "addDir", () => {
        event.sender.send( E_FILE_NAVIGATOR_UPDATED, path,  "addDir" );
      })
      .on( "change", () => {
        event.sender.send( E_FILE_NAVIGATOR_UPDATED, path,  "change" );
      })
      .on( "unlink", () => {
        event.sender.send( E_FILE_NAVIGATOR_UPDATED, path,  "unlink" );
      })
      .on( "unlinkDir", () => {
        event.sender.send( E_FILE_NAVIGATOR_UPDATED, path,  "unlink" );
      })
      .on( "error", ( error ) => {
        log.error( `Main process: chokidar: ${ error }` );
      });

};