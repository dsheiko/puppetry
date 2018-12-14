const { Ctx } = require( "../lib/bootstrap" ),
      ctx = new Ctx();

jest.setTimeout( 50000 );


describe( "New Project", () => {

  beforeAll( async () => {
    await ctx.startApp();
  });

  afterAll( async () => {
    ctx.cleanupTmpDirs();
    await ctx.stopApp();
  });


  test( "app opens New Project modal", async () => {
    expect( await ctx.client.isExisting( "#cWelcome" ) ).toBeTruthy();
    await ctx.client.click( "#cWelcomeNewProjectBtn" );
    await ctx.client.pause( 300 );
    await ctx.screenshot( "new-project-modal" );
    // New Project modal opens
    expect( await ctx.client.isExisting( ".c-new-project-modal" ) ).toBeTruthy();
  });

  test( "app populates New Project modal", async () => {
    ctx.createTmpDir( "new-project" );
    await ctx.client.setValue( ".c-new-project-modal #name", "Test Project" );
    ctx.app.webContents.send( "directorySelected", ctx.getTmpDir( "new-project" ) );
    await ctx.client.pause( 100 );
    await ctx.screenshot( "new-project-modal-populated" );
  });

  test( "app lands on Info page after opening", async () => {
    await ctx.client.click( ".c-new-project-modal .btn--modal-ok" );
    await ctx.client.pause( 300 );
    expect( await ctx.client.isExisting( "#cInfo" ) ).toBeTruthy();
    await ctx.screenshot( "new-project-lands-on-info-screen" );
  });

  test( "app opens New Suite modal by clicking Create on Info page", async() => {
    await ctx.client.click( "#cInfoCreateBtn" );
    await ctx.client.pause( 100 );
    await ctx.screenshot( "new-suite-modal" );
    expect( await ctx.client.isExisting( ".c-new-suite-modal" ) ).toBeTruthy();
  });

  // create new suite
  //

});
