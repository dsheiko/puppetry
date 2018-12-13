const { Application } = require( "spectron" ),
      { join } = require( "path" ),
      fs = require( "fs" ),
      ROOT_PATH = join( __dirname, "..", ".." ),
      DIST_PATH = join( ROOT_PATH, "dist" ),
      manifest = require( join( ROOT_PATH, "package.json" ) ),
      APP_PATH = process.platform === "win32" ? join( DIST_PATH, "win-unpacked", "puppetry.exe" ) :
        ( process.platform === "darwin" ? join( DIST_PATH, "mac", "puppetry.app" )
          : join( DIST_PATH, "linux-unpacked", "puppetry" ) );

let app;

const screenshot = async ( name ) => {
        const buf = await app.browserWindow.capturePage();
        fs.writeFileSync( join( __dirname, "screenshots", `${ name }.png` ), buf );
      },
      startApp = async() => {
        app = new Application({
          path: APP_PATH,
          env: {
            PUPPETRY_CLEAN_START: true
          }
        });
        await app.start();
        await app.client.waitUntilWindowLoaded();
      };

jest.setTimeout( 50000 );

describe( "Puppetry", () => {

  beforeAll( async () => {
    await startApp();
  });

  afterAll( async () => {
    await app.stop();
  });

  describe( "First launch", () => {

    test( "app shows welcome page", async () => {
      const win = app.browserWindow;
      expect( await win.isVisible() ).toBeTruthy();
      expect( await app.client.isExisting( "#cWelcome" ) ).toBeTruthy();
      await screenshot( "welcome-page" );
    });

    test( "toolbar does not have project name", async () => {
      expect( await app.client.isExisting( "#cToolbarProjectName" ) ).not.toBeTruthy();
    });
  });

  describe( "Demo project", () => {

    test( "it loads demo project by click", async () => {
      await app.client.click( "#cWelcomeDemoProjectBtn" );
      await app.client.waitForExist( "#cMain" );
      // wait until loading state
      await app.client.waitForExist( "#cLayout:not(.is-loading)" );
      // give it time to finish the animation
      await app.client.pause( 500 );
      await screenshot( "demo-project" );
    });
  });

});
