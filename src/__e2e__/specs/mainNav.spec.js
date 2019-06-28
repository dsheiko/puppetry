const { Ctx } = require( "../lib/bootstrap" ),
      S = require( "../lib/constants" ),
      ctx = new Ctx();

jest.setTimeout( 50000 );

describe( "Main Navigation", () => {

  beforeAll( async () => {
    await ctx.startApp();
    ctx.ns = "main-nav";
  });

  afterAll( async () => {
    ctx.cleanupTmpDirs();
    await ctx.stopApp();
  });

  afterEach( async() => {
    await ctx.checkLogErrors();
  });

  describe( "When no project is open", () => {

    test( "check items availability", async () => {
      // update component
      await ctx.client.moveToObject( "#cMainMenuFile" );

      await ctx.expectMenuItemsAvailable({
        "#cMainMenuNewProject": true,
        "#cMainMenuNewSuite": false,
        "#cMainMenuOpenProject": true,
        "#cMainMenuSaveSuite": false,
        "#cMainMenuSaveAsSuite": false,
        "#cMainMenuOpenSuite": false,
        "#cMainMenuExportProject": false,
        "#cMainMenuRun": false
      });

    });

  });

//  describe( "When suite is open", () => {
//
//    test( "check items availability", async () => {
//      await ctx.client.click( "#cWelcomeDemoProjectBtn" );
//      await ctx.client.pause( 800 );
//      // update component
//      await ctx.client.moveToObject( "#cMainMenuFile" );
//
//      await ctx.expectMenuItemsAvailable({
//        "#cMainMenuNewProject": true,
//        "#cMainMenuNewSuite": true,
//        "#cMainMenuOpenProject": true,
//        "#cMainMenuSaveSuite": true,
//        "#cMainMenuSaveAsSuite": true,
//        "#cMainMenuOpenSuite": true,
//        "#cMainMenuExportProject": true,
//        "#cMainMenuRun": true
//      });
//
//    });
//
//  });

});
