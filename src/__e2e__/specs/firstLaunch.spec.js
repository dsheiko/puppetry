const { Ctx } = require( "../lib/bootstrap" ),
      S = require( "../lib/constants" ),
      ctx = new Ctx();

jest.setTimeout( 50000 );

describe( "First launch", () => {

  beforeAll( async () => {
    await ctx.startApp();
    ctx.ns = "first-launch";
  });

  afterAll( async () => {
    await ctx.stopApp();
  });

  afterEach( async() => {
    await ctx.checkLogErrors();
  });

  describe( "Welcome screen", () => {

    test( "app shows welcome page", async () => {
      const win = ctx.app.browserWindow;
      expect( await win.isVisible() ).toBeTruthy();
      expect( await ctx.client.isExisting( "#cWelcome" ) ).toBeTruthy();
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( "welcome-screen" );
    });

    test( "toolbar does not have project name", async () => {
      expect( await ctx.client.isExisting( "#cToolbarProjectName" ) ).not.toBeTruthy();
    });



  });


  describe( "Button Create project on welcome screen", () => {
    test( "pane has Create New Project button", async () => {
      expect( await ctx.client.isExisting( "#cWelcomeNewProjectBtn" ) ).toBeTruthy();
    });
    test( "clicking on Create New Project opens modal", async () => {
      await ctx.client.click( "#cWelcomeNewProjectBtn" );
      await ctx.client.pause( 300 );
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( "new-project-modal" );
      expect( await ctx.client.isExisting( ".c-new-project-modal"  ) ).toBeTruthy();
      await ctx.client.click( `.c-new-project-modal ${ S.MODAL_CLOSE_ICON }` );
      await ctx.client.pause( 300 );
      await ctx.screenshot( "new-project-closed" );
    });
  });

  describe( "Button Demo project on welcome screen", () => {

    test( "it loads demo project by click", async () => {
      await ctx.client.click( "#cWelcomeDemoProjectBtn" );
      await ctx.client.waitForExist( "#cMain" );
      await ctx.waitUntilLayoutUpdates();
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( "demo-project-screen" );
    });
  });

});
