const { ipcMain, dialog, remote, BrowserWindow, rendererWindow } = require( "electron" ),
      { E_BROWSE_DIRECTORY, E_DIRECTORY_SELECTED, E_RUN_TESTS,
        E_TEST_REPORTED, E_WATCH_FILE_NAVIGATOR, E_BROWSE_FILE, E_FILE_SELECTED,
        E_INSTALL_RUNTIME_TEST, E_SHOW_CONFIRM_DIALOG, E_CONFIRM_DIALOG_VALUE,
        E_GIT_INIT, E_GIT_COMMIT, E_GIT_SET_REMOTE, E_RENDERER_ERROR, E_RENDERER_INFO,
        E_GIT_PUSH, E_GIT_SYNC, E_GIT_SYNC_RESPONSE, E_GIT_LOG, E_GIT_LOG_RESPONSE,
        E_GIT_CHECKOUT, E_GIT_CHECKOUT_RESPONSE,
        E_GIT_CHECKOUT_M, E_GIT_CHECKOUT_M_RESPONSE,
        E_GIT_REVERT, E_GIT_REVERT_RESPONSE,
        E_GIT_CURRENT_BRANCH, E_GIT_CURRENT_BRANCH_RESPONSE,
        E_GIT_CLONE, E_GIT_CLONE_RESPONSE,
        E_GIT_COMMIT_RESPONSE, E_OPEN_RECORDER_WINDOW,
        E_RECEIVE_RECORDER_SESSION, E_DELEGATE_RECORDER_SESSION
      } = require( "../constant" ),
      watchFiles = require( "./file-watcher" ),
      electron = require( "electron" ),
      log = require( "electron-log" ),
      { installRuntimeTest } = require( "./install-runtime-test" ),
      runTests = require( "./test-runner" ),
      path = require( "path" ),
      url = require( "url" ),
      gitApi = require( "./git-api" );

function findExternalDisplay() {
  const displays = electron.screen.getAllDisplays();
  return displays.find( ( display ) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });
}


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
        nodeIntegration: true
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
  });


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
        { name: "Files" }
      ]
    }, ( files ) => {
      event.sender.send( E_FILE_SELECTED, files ? files[ 0 ] : "" );
    });
  });

  ipcMain.on( E_WATCH_FILE_NAVIGATOR, async ( event, projectDirectory ) => {
    watchFiles( event, projectDirectory );
  });

  ipcMain.on( E_GIT_INIT, async ( event, projectDirectory, username, email ) => {
    try {
      await gitApi.init( projectDirectory, username, email );
      event.sender.send( E_RENDERER_INFO, "Empty local Git repository created" );
    } catch ( err ) {
      log.error( `Main process: event-dispatcher.E_GIT_INIT: ${ err.message }` );
      event.sender.send( E_RENDERER_ERROR, `Cannot initialize local Git: ${ err.message }` );
    }
  });

  ipcMain.on( E_GIT_COMMIT, async ( event, message, projectDirectory, username, email ) => {
    try {
      const sha = await gitApi.commit( message, projectDirectory, username, email );
      event.sender.send( E_GIT_COMMIT_RESPONSE );
      event.sender.send( E_RENDERER_INFO, `New commit ${ sha } created` );
    } catch ( err ) {
      log.error( `Main process: event-dispatcher.E_GIT_COMMIT: ${ err.message }` );
      event.sender.send( E_RENDERER_ERROR, `Cannot commit changes: ${ err.message }` );
    }
  });

  ipcMain.on( E_GIT_SET_REMOTE, async ( event, remoteRepository, projectDirectory, credentials  ) => {
    try {
      await gitApi.setRemote( remoteRepository, projectDirectory, credentials  );
      event.sender.send( E_RENDERER_INFO, `New remote repository is set successfully` );
    } catch ( err ) {
      log.error( `Main process: event-dispatcher.E_GIT_SET_REMOTE: ${ err.message }` );
      event.sender.send( E_RENDERER_ERROR, `Cannot set remote repository: ${ err.message }` );
    }
  });

  ipcMain.on( E_GIT_SYNC, async ( event, projectDirectory, credentials, username, email, url  ) => {
    try {
      if ( !await gitApi.sync( projectDirectory, credentials, username, email, url ) ) {
        event.sender.send( E_RENDERER_INFO, `Merging conflicts detected. `
          + `Remote version history is fetched 'as-it-is' and the current version put on top of it` );
      }
      event.sender.send( E_RENDERER_INFO, `Changes synced with remote repository successfully` );
      event.sender.send( E_GIT_SYNC_RESPONSE );
    } catch ( err ) {
      console.error( err.message, err );
      log.error( `Main process: event-dispatcher.E_GIT_SYNC: ${ err.message }` );
      event.sender.send( E_RENDERER_ERROR, `Cannot sync with the remote repository: ${ err.message }` );
    }
  });

  ipcMain.on( E_GIT_LOG, async ( event, projectDirectory  ) => {
    try {
      event.sender.send( E_GIT_LOG_RESPONSE, await gitApi.log( projectDirectory ) );
    } catch ( err ) {
      log.error( `Main process: event-dispatcher.E_GIT_LOG: ${ err.message }` );
      event.sender.send( E_RENDERER_ERROR, `Cannot receive log: ${ err.message }` );
    }
  });

  ipcMain.on( E_GIT_CHECKOUT, async ( event, projectDirectory, oid, message ) => {
    try {
      await gitApi.checkout( projectDirectory, oid );
      event.sender.send( E_GIT_CHECKOUT_RESPONSE, oid, message );
    } catch ( err ) {
      log.error( `Main process: event-dispatcher.E_GIT_CHECKOUT: ${ err.message }` );
      event.sender.send( E_RENDERER_ERROR, `Cannot checkout to ${ oid }: ${ err.message }` );
    }
  });

  ipcMain.on( E_GIT_CHECKOUT_M, async ( event, projectDirectory ) => {
    try {
      await gitApi.checkout( projectDirectory, "master" );
      event.sender.send( E_GIT_CHECKOUT_M_RESPONSE );
    } catch ( err ) {
      log.error( `Main process: event-dispatcher.E_GIT_CHECKOUT_M: ${ err.message }` );
      event.sender.send( E_RENDERER_ERROR, `Cannot checkout to master: ${ err.message }` );
    }
  });

  ipcMain.on( E_GIT_CURRENT_BRANCH, async ( event, projectDirectory ) => {
    try {
      const branch = await gitApi.currentBranch( projectDirectory );
      event.sender.send( E_GIT_CURRENT_BRANCH_RESPONSE, branch );
    } catch ( err ) {
      // supress
    }
  });

  ipcMain.on( E_GIT_CLONE, async ( event, projectDirectory, remoteRepository, credentials ) => {
    try {
      const branch = await gitApi.clone( projectDirectory, remoteRepository, credentials );
      event.sender.send( E_GIT_CLONE_RESPONSE, branch );
    } catch ( err ) {
      log.error( `Main process: event-dispatcher.E_GIT_CLONE: ${ err.message }` );
      event.sender.send( E_RENDERER_ERROR, `Cannot clone: ${ err.message }` );
    }
  });

  ipcMain.on( E_RECEIVE_RECORDER_SESSION, async ( event, targets, commands ) => {
    mainWindow.webContents.send( E_DELEGATE_RECORDER_SESSION, { targets, commands } );
  });

};