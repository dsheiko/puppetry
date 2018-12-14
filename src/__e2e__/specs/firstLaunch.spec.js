const { Ctx } = require( "../lib/bootstrap" ),
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
      await ctx.waitUntilLayoutUpdates();
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( "demo-project" );
    });
  });

});
