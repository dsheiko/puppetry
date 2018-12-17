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
    await ctx.stopApp();
  });

  afterEach( async() => {
    await ctx.checkLogErrors();
  });

  describe( "When no project open", () => {

    test( "check items availability", async () => {

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

});
