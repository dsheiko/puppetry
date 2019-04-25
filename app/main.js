
const electron = require( "electron" ),
      { session, protocol, app, BrowserWindow } = electron,
      path = require( "path" ),
      log = require( "electron-log" ),
      url = require( "url" ),
      APP_WIN_WIDTH = 1200,
      APP_WIN_HEIGHT = 720; // 768

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

process.on( "uncaughtException", ( err ) => {
  log.warn( `Main process: Caught exception: ${err}` );
});

function findExternalDisplay() {
  const displays = electron.screen.getAllDisplays();
  return displays.find( ( display ) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });
}

function createWindow() {

  const PROTOCOL = "file",
        icon = path.join( __dirname, "assets/512x512.png" );

  if ( process.env.ELECTRON_ENV === "dev" ) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require( "electron-devtools-installer" );

    installExtension( REACT_DEVELOPER_TOOLS )
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    installExtension( REDUX_DEVTOOLS )
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
  }


  const externalDisplay = findExternalDisplay(),
        position = externalDisplay
            ? {
              x: externalDisplay.bounds.x + Math.ceil( ( externalDisplay.bounds.width - APP_WIN_WIDTH ) / 2 ) ,
              y: externalDisplay.bounds.y + Math.ceil( ( externalDisplay.bounds.height - APP_WIN_HEIGHT ) / 2 )
            }
            : {};

  // Create the browser window.
  mainWindow = new BrowserWindow( Object.assign({
    width: APP_WIN_WIDTH,
    height: APP_WIN_HEIGHT, // 768
    minWidth: 960,
    minHeight: 540,
    frame: false,
    devTools: process.env.ELECTRON_ENV === "dev",
    title: "Puppetry",
    icon
  }, position ));

  // and load the index.html of the app.
  mainWindow.loadURL( url.format({
    pathname: path.join( __dirname, "index.html" ),
    protocol: "file:",
    slashes: true
  }) );

  require( "./main/menu" )( mainWindow );
  require( "./main/event-dispatcher" );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on( "closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on( "ready", createWindow );

// Quit when all windows are closed.
app.on( "window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if ( process.platform !== "darwin" ) {
    app.exit( 0 );
  }
});

app.on( "activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
if ( process.env.ELECTRON_ENV === "dev" ) {
 require( "electron-debug" )();
}


