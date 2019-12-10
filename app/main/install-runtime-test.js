const npmlog = require( "npm/node_modules/npmlog" ),
      npm = require( "npm" ),
      { join } = require( "path" ),
      log = require( "electron-log" ),

      { E_RUNTIME_TEST_PROGRESS, E_RUNTIME_TEST_MILESTONE, E_RUNTIME_TEST_ERROR } = require( "../constant" ),
      NPM_MILESTONES = {
       "stage:loadCurrentTree": 6.25,
       "stage:loadIdealTree:cloneCurrentTree": 6.25 * 2,
       "stage:loadIdealTree:loadShrinkwrap": 6.25 * 3,
       "stage:loadIdealTree:loadAllDepsIntoIdealTree": 6.25 * 4,
       "stage:loadIdealTree": 6.25 * 5,
       "stage:generateActionsToTake": 6.25 * 6,
       "action:extract": 6.25 * 7,
       "action:finalize": 6.25 * 8,
       "action:refresh-package-json": 6.25 * 9,
       "action:preinstall": 6.25 * 10,
       "action:build": 6.25 * 11,
       "action:install": 6.25 * 12,
       "action:postinstall": 6.25 * 13,
       "stage:executeActions": 6.25 * 14,
       "stage:rollbackFailedOptional": 6.25 * 15,
       "stage:runTopLevelLifecycles": 6.25 * 16
      };


function downloadChromium( event, appInstallDirectory ) {
  const install = require( "./vendor/puppeteer/install" );
  try {
    install( join( appInstallDirectory, "node_modules/puppeteer" ), {
      handleDone: ( revisionInfo ) => {
         log.silly( `Chromium downloaded to ${ revisionInfo.folderPath }`);
         event.sender.send( E_RUNTIME_TEST_PROGRESS, {
            progress: 100,
            isDone: true,
            data: []
          });
      },
      handleProgress: ( payload ) => {
        event.sender.send( E_RUNTIME_TEST_PROGRESS, {
          progress: payload.progress,
          downloaded: `${ payload.downloadedBytes }/${ payload.totalBytes }`,
          process: "Downloading Chromium",
          isDone: false,
          data: []
        });
      },
      handleError: ( err ) => {
        log.error( `Main process: NPM(4): ${err}` );
        event.sender.send( E_RUNTIME_TEST_ERROR, err );
      }
    });
  } catch ( err ) {
    console.error( "Install error", err);
  }
}

exports.installRuntimeTest = ( event, appInstallDirectory ) => {
  if ( !appInstallDirectory ) {
    return;
  }

  npmlog.on( "log", msg => {
    if ( msg.prefix === "postinstall" ) {
      event.sender.send( E_RUNTIME_TEST_MILESTONE, `postinstall ${ msg.message }` );
      return;
    }
    if ( msg.prefix === "fetch" ) {
      event.sender.send( E_RUNTIME_TEST_MILESTONE, `fetch ${ msg.message }` );
      return;
    }
    if ( msg.prefix === "extract" ) {
      event.sender.send( E_RUNTIME_TEST_MILESTONE, `extract ${ msg.message }` );
      return;
    }
  });

   process.on("time", milestone => {
     event.sender.send( E_RUNTIME_TEST_MILESTONE, milestone );
   });

  process.on("timeEnd", milestone => {
    if ( !( milestone in NPM_MILESTONES ) ) {
      return;
    }
    event.sender.send( E_RUNTIME_TEST_PROGRESS, {
      progress: NPM_MILESTONES[ milestone ],
      process: "Installing dependencies",
      downloaded: 0,
      isDone: false,
      data: []
    });
  });

/**
 * E.g. 16 = 100%
 */

  npm.load({
    loaded: false,
    progress: false,
    "ignore-scripts": true,
    "no-audit": true
  }, ( err ) => {
    if ( err ) {
      log.error( `Main process: NPM(1): ${err}` );
      return event.sender.send( E_RUNTIME_TEST_ERROR, err );
    }

    // Show progress immediatelly
    event.sender.send( E_RUNTIME_TEST_PROGRESS, {
      progress: 1,
      process: "Installing dependencies",
      downloaded: 0,
      isDone: false,
      data: []
    });

    npm.commands.install( appInstallDirectory, [
      "cross-env@^5.2.0",
      "jest@^24.9.0",
      "node-fetch@^2.6.0",
      "faker@^4.1.0",
      "jsonpath@^1.0.2",
      "node-localstorage@^1.3.1",
      "puppeteer@2.0.0",
      "shelljs@^0.8.2",
      "pixelmatch@^5.1.0",
      "pngjs@^3.4.0",
      "text-table@^0.2.0"
    ], ( err, data ) => {
      if ( err ) {
        log.error( `Main process: NPM(2): ${err}` );
        return event.sender.send( E_RUNTIME_TEST_ERROR, err );
      }

      log.silly( `\n\nDependencies installed in ${ appInstallDirectory }\n` );
      event.sender.send( E_RUNTIME_TEST_MILESTONE, "" );
      downloadChromium( event, appInstallDirectory );


    });
    npm.on("error", msg => {
      log.error( `Main process: NPM(3): ${msg}` );
      event.sender.send( E_RUNTIME_TEST_ERROR, msg );
    });

  });
};