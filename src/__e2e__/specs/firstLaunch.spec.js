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
      expect( await ( await ctx.client.$( "#cWelcome" ) ).isExisting() ).toBeTruthy();     
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( "welcome-screen" );
    });

    test( "toolbar does not have project name", async () => {
      expect( await ( await ctx.client.$( "#cToolbarProjectName" ) ).isExisting() ).not.toBeTruthy(); 
    });



  });


  describe( "Button Create project on welcome screen", () => {
    test( "pane has Create New Project button", async () => {
      expect( await ( await ctx.client.$( "#cWelcomeNewProjectBtn" ) ).isExisting() ).toBeTruthy();
    });
    test( "clicking on Create New Project opens modal", async () => {
      await (await ctx.client.$( "#cWelcomeNewProjectBtn" )).click();
      await ctx.client.pause( 300 );
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( "new-project-modal" );
      expect( await ( await ctx.client.$( ".c-new-project-modal" ) ).isExisting() ).toBeTruthy();
      await (await ctx.client.$( `.c-new-project-modal ${ S.MODAL_CLOSE_ICON }` )).click();
      await ctx.client.pause( 300 );
      await ctx.screenshot( "new-project-closed" );
    });
  });

  describe( "Button Demo project on welcome screen", () => {

    test( "it loads demo project by click", async () => {
      await (await ctx.client.$( "#cWelcomeDemoProjectBtn" )).click();
      await ctx.client.pause( 200 );
      if ( await (await ctx.client.$( `.smalltalk button[data-name="js-ok"]`  )).isExisting() ) {
        await (await ctx.client.$( `.smalltalk button[data-name="js-ok"]` )).click();
      }

      await ctx.waitUntilLayoutUpdates();
      await ctx.screenshot( "demo-project-screen" );
      await (await ctx.client.$( "#cMain" )).waitForExist();
      expect( await ctx.boundaryError() ).toBeFalsy();
    });
  });

});
