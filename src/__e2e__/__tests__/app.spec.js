const { Ctx } = require( "../lib/bootstrap"),
      ctx = new Ctx();

jest.setTimeout( 50000 );

describe( "First launch", () => {

  beforeAll( async () => {
    await ctx.startApp();
  });

  afterAll( async () => {
    await ctx.stopApp();
  });

  describe( "Welcome page", () => {

    test( "app shows welcome page", async () => {
      const win = ctx.app.browserWindow;
      expect( await win.isVisible() ).toBeTruthy();
      expect( await ctx.client.isExisting( "#cWelcome" ) ).toBeTruthy();
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( "welcome-page" );
    });

    test( "toolbar does not have project name", async () => {
      expect( await ctx.client.isExisting( "#cToolbarProjectName" ) ).not.toBeTruthy();
    });
  });

  describe( "Demo project", () => {

    test( "it loads demo project by click", async () => {
      await ctx.client.click( "#cWelcomeDemoProjectBtn" );
      await ctx.client.waitForExist( "#cMain" );
      await waitUntilLayoutUpdates();
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( "demo-project" );
    });
  });

});


describe( "New Project", () => {

  beforeAll( async () => {
    await ctx.startApp();
  });

  afterAll( async () => {
    ctx.cleanupTmpDirs();
    await ctx.stopApp();
  });

  describe( "Welcome page", () => {

    test( "app opens New Project modal", async () => {
      expect( await ctx.client.isExisting( "#cWelcome" ) ).toBeTruthy();
      await ctx.client.click( "#cWelcomeNewProjectBtn" );
      await ctx.client.pause( 300 );
      await ctx.screenshot( "new-project-modal" );
      // New Project modal opens
      expect( await ctx.client.isExisting( ".c-new-project-modal" ) ).toBeTruthy();
    });

    test( "app opens New Project modal", async () => {
      ctx.setupTmpDir( "new-project" );
      await ctx.client.setValue( ".c-new-project-modal #name", "Test Project");
      await ctx.setBrowseDirectory( "new-project" );
      await ctx.client.pause( 300 );
      await ctx.screenshot( "new-project-modal-populate" );
    });

  });
});
