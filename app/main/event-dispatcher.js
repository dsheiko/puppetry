const { ipcMain, dialog, remote, BrowserWindow, rendererWindow, app, session } = require( "electron" ),
      { E_BROWSE_DIRECTORY, E_DIRECTORY_SELECTED, E_RUN_TESTS,
        E_TEST_REPORTED, E_WATCH_FILE_NAVIGATOR, E_BROWSE_FILE, E_FILE_SELECTED,
        E_INSTALL_RUNTIME_TEST, E_SHOW_CONFIRM_DIALOG, E_CONFIRM_DIALOG_VALUE, E_OPEN_RECORDER_WINDOW,
        E_RECEIVE_RECORDER_SESSION, E_DELEGATE_RECORDER_SESSION
      } = require( "../constant" ),
      watchFiles = require( "./file-watcher" ),
      electron = require( "electron" ),
      log = require( "electron-log" ),
      { installRuntimeTest } = require( "./install-runtime-test" ),
      runTests = require( "./test-runner" ),
      path = require( "path" ),
      url = require( "url" );

function findExternalDisplay() {
  const displays = electron.screen.getAllDisplays();
  return displays.find( ( display ) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });
}

// https://github.com/dsheiko/puppetry/issues/59
app.on( "certificate-error", ( event, webContents, url, error, certificate, callback ) => {
  callback( true );
});

module.exports = function( mainWindow ) {

  ipcMain.on( E_SHOW_CONFIRM_DIALOG, async ( event, runtimeTestDirectory ) => {
     const res = dialog.showMessageBox( {
          type: "warning",
          buttons: [ "Save", "Ignore" ],
          title: "Unsaved changes",
          message: "You have unsaved changes in the open suite"
      });
     event.sender.send( E_CONFIRM_DIALOG_VALUE, res );
  });


  ipcMain.on( E_OPEN_RECORDER_WINDOW, async ( event ) => {

    const externalDisplay = findExternalDisplay(),
          icon = path.join( __dirname, "..", "assets/512x512.png" ),
          APP_WIN_WIDTH = 1366,
          APP_WIN_HEIGHT = 768,
          position = externalDisplay
              ? {
                x: externalDisplay.bounds.x + Math.ceil( ( externalDisplay.bounds.width - APP_WIN_WIDTH ) / 2 ) ,
                y: externalDisplay.bounds.y + Math.ceil( ( externalDisplay.bounds.height - APP_WIN_HEIGHT ) / 2 )
              }
              : {};

    // Create the browser window.
    const recorderWindow = new BrowserWindow(Object.assign({
      webPreferences: {
        webviewTag: true,
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      },
      width: APP_WIN_WIDTH,
      height: APP_WIN_HEIGHT,
      minWidth: 320,
      minHeight: 200,
      frame: true,
      devTools: process.env.ELECTRON_ENV === "dev",
      title: "Puppetry Recorder",
      icon
    }, position ));

    // and load the index.html of the app.
    recorderWindow.loadURL( url.format({
      pathname: path.join( __dirname, "..", "recorder.html" ),
      protocol: "file:",
      slashes: true
    }) );

    recorderWindow.focus();
    // https://github.com/dsheiko/puppetry/issues/61
    session.fromPartition( "persist:recorder" ).clearStorageData();
  });


  ipcMain.on( E_BROWSE_DIRECTORY, ( event, callerId = "id0" ) => {
    dialog.showOpenDialog({
      properties: [ "openDirectory", "createDirectory" ]
    }).then(result => {
      event.sender.send( E_DIRECTORY_SELECTED, result.filePaths ? result.filePaths[ 0 ] : "", callerId );
    }).catch( ( err ) => {
      console.log( err );
    });
  });

  ipcMain.on( E_INSTALL_RUNTIME_TEST, async ( event, runtimeTestDirectory ) => {
    try {
      installRuntimeTest( event, runtimeTestDirectory );
    } catch ( err ) {

    }
  });


  ipcMain.on( E_RUN_TESTS, async ( event, cwd, targetFiles ) => {
    try {
      const res = await runTests( cwd, targetFiles );
      console.log( "\n" );
      event.returnValue = res;
    } catch ( err ) {
      event.returnValue = { results: `Error: ${ err.message }` };
    }
  });


  ipcMain.on( E_BROWSE_FILE, ( event, defaultPath ) => {
    dialog.showOpenDialog({
      defaultPath,
      properties: [ "openFile" ],
      filters: [
        { name: "Files" }
      ]
    }).then(result => {
      event.sender.send( E_FILE_SELECTED, result.filePaths ? result.filePaths[ 0 ] : "" );
    }).catch( ( err ) => {
      console.log( err );
    });

  });

  ipcMain.on( E_WATCH_FILE_NAVIGATOR, async ( event, projectDirectory ) => {
    watchFiles( event, projectDirectory );
  });


  ipcMain.on( E_RECEIVE_RECORDER_SESSION, async ( event, targets, commands ) => {
    mainWindow.webContents.send( E_DELEGATE_RECORDER_SESSION, { targets, commands } );
  });

};