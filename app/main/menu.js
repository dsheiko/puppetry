const { app, ipcMain, Menu } = require( "electron" ),
      { E_PROJECT_LOADED, E_SUITE_LOADED, E_MENU_NEW_PROJECT, E_MENU_NEW_SUITE,
        E_MENU_OPEN_PROJECT, E_MENU_SAVE_SUITE, E_MENU_SAVE_SUITE_AS, E_SUITE_LIST_UPDATED,
        E_MENU_OPEN_SUITE, E_MENU_EXPORT_PROJECT, E_MENU_EXIT_APP, E_MENU_RUN } = require( "../constant" );

function buildAppMenu( win, projectDirectory = null, suiteFilename = null, files = [] ) {
  const template = [
    {
      label: "File",
      submenu: [

        {
          label: "New Project...",
          click () {
            win.send( E_MENU_NEW_PROJECT );
          }
        },
        {
          label: "New Suite...",
          enabled: Boolean( projectDirectory ),
          click () {
            win.send( E_MENU_NEW_SUITE );
          }
        },
        {
          label: "Open Project...",
          click () {
            win.send( E_MENU_OPEN_PROJECT );
          }
        },
        {
          label: "Save Suite",
          enabled: Boolean( suiteFilename ),
          click () {
            win.send( E_MENU_SAVE_SUITE );
          }
        },
        {
          label: "Save As...",
          enabled: Boolean( suiteFilename ),
          click () {
            win.send( E_MENU_SAVE_SUITE_AS );
          }
        },
        {
          label: "Open Suite...",
          enabled: Boolean( projectDirectory ) && Boolean( files.length ),
          click () {
            win.send( E_MENU_OPEN_SUITE );
          }
        },
        {
          label: "Export Project...",
          enabled: Boolean( projectDirectory ),
          click () {
            win.send( E_MENU_EXPORT_PROJECT );
          }
        },
        {
          label: "Exit",
          click () {
            win.send( E_MENU_EXIT_APP );
          }
        }
      ]
    },
    {
      label: "Run",
      submenu: [
        {
          label: "Run Project...",
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
        { role: "pasteandmatchstyle" },
        { role: "delete" },
        { role: "selectall" }
      ]
    },

    {
      role: "window",
      submenu: [
        {role: "minimize"}
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