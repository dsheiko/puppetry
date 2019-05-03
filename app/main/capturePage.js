const { globalShortcut, ipcRenderer } = require( "electron" ),
      fs = require( "fs" ),
      { E_RENDERER_INFO } = require( "../constant" ),
      { join } = require( "path" );
/**
 * Creates page screenshot on press Ctrl-Shit-4
 * Useful for documenting the tool
 *
 * @param {BrowserWindow} win
 */
module.exports = function( win ) {

  globalShortcut.register('CommandOrControl+Shift+4', () => {
    win.capturePage( img => {
      const date = new Date(),
            ts = Math.round( date.getTime() / 1000 ),
            filename = `screenshot-${ ts }.png`;
      fs.writeFileSync(
        join( __dirname, "..", "..", "dist", filename ), img.toPNG() );
        win.webContents.send( E_RENDERER_INFO, `New screenshot ${ filename } added to ./dist` );
    });
  });

};