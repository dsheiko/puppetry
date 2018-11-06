const { ipcMain, dialog } = require( "electron" ),
      { E_BROWSE_DIRECTORY, E_DIRECTORY_SELECTED, E_RUN_TESTS,
        E_TEST_REPORTED, E_WATCH_FILE_NAVIGATOR, E_BROWSE_FILE, E_FILE_SELECTED,
        E_INSTALL_RUNTIME_TEST
      } = require( "../constant" ),
      watchFiles = require( "./file-watcher" ),
      { installRuntimeTest } = require( "./install-runtime-test" ),
      runTests = require( "./test-runner" );


ipcMain.on( E_BROWSE_DIRECTORY, ( event ) => {
  dialog.showOpenDialog({
    properties: [ "openDirectory", "createDirectory" ]
  }, ( directories ) => {
    event.sender.send( E_DIRECTORY_SELECTED, directories ? directories[ 0 ] : "" );
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
    event.returnValue = await runTests( cwd, targetFiles );
    console.log( "\n" );
  } catch ( err ) {
    event.returnValue = { results: `Error: ${ err.message }` };
  }
});


ipcMain.on( E_BROWSE_FILE, ( event, defaultPath ) => {
  dialog.showOpenDialog({
    defaultPath,
    properties: [ "openFile" ],
    filters: [
      { name: "Suites", extensions: [ "json" ] }
    ]
  }, ( files ) => {
    event.sender.send( E_FILE_SELECTED, files ? files[ 0 ] : "" );
  });
});

ipcMain.on( E_WATCH_FILE_NAVIGATOR, async ( event, projectDirectory ) => {
  watchFiles( event, projectDirectory );
});