const { ipcMain, dialog, app } = require( "electron" ),
      { E_BROWSE_DIRECTORY, E_DIRECTORY_SELECTED, E_RUN_TESTS,
        E_TEST_REPORTED, E_WATCH_FILE_NAVIGATOR, E_BROWSE_FILE, E_FILE_SELECTED,
        E_INSTALL_RUNTIME_TEST, E_SHOW_CONFIRM_DIALOG, E_CONFIRM_DIALOG_VALUE,
        E_RENDERER_ERROR, E_RENDERER_INFO
      } = require( "../constant" ),
      watchFiles = require( "./file-watcher" ),
      log = require( "electron-log" ),
      { installRuntimeTest } = require( "./install-runtime-test" ),
      runTests = require( "./test-runner" );

// https://github.com/dsheiko/puppetry/issues/59
app.on( "certificate-error", ( event, webContents, url, error, certificate, callback ) => {
  callback( true );
});

module.exports = function() {

  ipcMain.on( E_SHOW_CONFIRM_DIALOG, async ( event, runtimeTestDirectory ) => {
     const res = dialog.showMessageBox( {
          type: "warning",
          buttons: [ "Save", "Ignore" ],
          title: "Unsaved changes",
          message: "You have unsaved changes in the open suite"
      });
     event.sender.send( E_CONFIRM_DIALOG_VALUE, res );
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

};