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

  describe( "When empty project is open", () => {

    test( "check items availability", async () => {
      await ctx.client.click( "#cWelcomeNewProjectBtn" );
      await ctx.client.pause( 200 );
      // create a new project
      ctx.createTmpDir( "new-project" );
      await ctx.client.setValue( `${ S.MODAL_NEW_PROJECT } #name`, "Test Project" );
      ctx.app.webContents.send( "directorySelected", ctx.getTmpDir( "new-project" ) );
      await ctx.client.pause( 100 );
      await ctx.client.click( `${ S.MODAL_NEW_PROJECT } ${ S.MODAL_OK_BTN }` );
      await ctx.client.pause( 400 );
      // update component
      await ctx.client.moveToObject( "#cMainMenuFile" );

      await ctx.expectMenuItemsAvailable({
        "#cMainMenuNewProject": true,
        //"#cMainMenuNewSuite": true,
        "#cMainMenuOpenProject": true,
        "#cMainMenuSaveSuite": false,
        "#cMainMenuSaveAsSuite": false,
        "#cMainMenuOpenSuite": false,
        "#cMainMenuExportProject": true,
        "#cMainMenuRun": true
      });

    });

  });

  describe( "When suite is open", () => {

    test( "check items availability", async () => {
      await ctx.client.click( "#cInfoDemoProjectBtn" );
      await ctx.client.pause( 500 );
      // update component
      await ctx.client.moveToObject( "#cMainMenuFile" );

      await ctx.expectMenuItemsAvailable({
        "#cMainMenuNewProject": true,
        "#cMainMenuNewSuite": true,
        "#cMainMenuOpenProject": true,
        "#cMainMenuSaveSuite": true,
        "#cMainMenuSaveAsSuite": true,
        "#cMainMenuOpenSuite": true,
        "#cMainMenuExportProject": true,
        "#cMainMenuRun": true
      });

    });

  });

});
