const { app, dialog, ipcMain, Menu, shell } = require( "electron" ),
      { E_PROJECT_LOADED, E_SUITE_LOADED, E_MENU_NEW_PROJECT, E_MENU_NEW_SUITE,
        E_MENU_OPEN_PROJECT, E_MENU_SAVE_SUITE, E_MENU_SAVE_SUITE_AS, E_SUITE_LIST_UPDATED,
        E_MENU_OPEN_SUITE, E_MENU_EXPORT_PROJECT, E_MENU_EXIT_APP, E_MENU_RUN } = require( "../constant" );

const isMac = process.platform === "darwin";

function buildAppMenu( win, projectDirectory = null, suiteFilename = null, files = [] ) {
  const template = [

    ...( isMac ? [ {
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    } ] : [] ),

    {
      label: "File",
      submenu: [
        {
          label: "New Test Plan...",
          click () {
            win.send( E_MENU_NEW_PROJECT );
          }
        },
        {
          label: "Open Test Plan...",
          click () {
            win.send( E_MENU_OPEN_PROJECT );
          }
        },
        { type: "separator" },
        {
          label: "Export Test Plan for CI...",
          enabled: Boolean( projectDirectory ),
          click () {
            win.send( E_MENU_EXPORT_PROJECT );
          }
        },
        { type: "separator" },
        {
          label: "New Test Suite...",
          enabled: Boolean( projectDirectory ),
          click () {
            win.send( E_MENU_NEW_SUITE );
          }
        },
        {
          label: "Open Test Suite...",
          enabled: Boolean( projectDirectory ) && Boolean( files.length ),
          click () {
            win.send( E_MENU_OPEN_SUITE );
          }
        },
        {
          label: "Save Test Suite",
          enabled: Boolean( suiteFilename ),
          click () {
            win.send( E_MENU_SAVE_SUITE );
          }
        },
        {
          label: "Save Test Suite As...",
          enabled: Boolean( suiteFilename ),
          click () {
            win.send( E_MENU_SAVE_SUITE_AS );
          }
        },
        ...( !isMac ? [
          { type: "separator" },
          {
            label: "Exit",
            click () {
              win.send( E_MENU_EXIT_APP );
            }
          }
        ] : [] )
      ]
    },

    {
      label: "Run",
      submenu: [
        {
          label: "Run Test Plan...",
          enabled: Boolean( projectDirectory ),
          click () {
            win.send( E_MENU_RUN );
          }
        }
      ]
    },

    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac ? [
          { role: "pasteAndMatchStyle" },
          { role: "delete" },
          { role: "selectAll" },
          { type: "separator" },
          {
            label: "Speech",
            submenu: [
              { role: "startspeaking" },
              { role: "stopspeaking" }
            ]
          }
        ] : [
          { role: "delete" },
          { type: "separator" },
          { role: "selectAll" }
        ])
      ]
    },

    {
      role: "window",
      submenu: [
        { role: "minimize" },
        ...( isMac ? [
          { role: "zoom" },
          { type: "separator" },
          { role: "front" }
        ] : [] )
      ]
    },

    {
      label: "Help",
      submenu: [
        {
          label: "Documentation",
          click () { shell.openExternal( "https://github.com/dsheiko/puppetry" ); }
        },
        {
          label: "Report an Issue",
          click () { shell.openExternal( "https://github.com/dsheiko/puppetry/issues" ); }
        },
        { type: "separator" },
        {
          label: "About Puppetry",
          click () {
            dialog.showMessageBox( win, {
              type: "info",
              title: "About Puppetry",
              message: `Puppetry v${ app.getVersion() }`,
              detail: "Codeless end-to-end test automation.\nhttps://github.com/dsheiko/puppetry",
              buttons: [ "OK" ]
            });
          }
        }
      ]
    }

  ];

  const menu = Menu.buildFromTemplate( template );
  Menu.setApplicationMenu( menu );

}

module.exports = function( win ) {

  ipcMain.on( E_SUITE_LIST_UPDATED, ( event, projectDirectory, suiteFilename, files ) => {
    buildAppMenu( win, projectDirectory, suiteFilename, files );
  });

  ipcMain.on( E_SUITE_LOADED, ( event, projectDirectory, suiteFilename, files ) => {
    buildAppMenu( win, projectDirectory, suiteFilename, files );
  });

  ipcMain.on( E_PROJECT_LOADED, ( event, projectDirectory ) => {
    buildAppMenu( win, projectDirectory );
  });

  buildAppMenu( win );

};
