const { Ctx } = require( "../lib/bootstrap" ),
      S = require( "../lib/constants" ),
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
    expect( await ctx.client.isExisting( S.MODAL_NEW_PROJECT ) ).toBeTruthy();
  });

  test( "app populates New Project modal", async () => {
    ctx.createTmpDir( "new-project" );
    await ctx.client.setValue( `${ S.MODAL_NEW_PROJECT } #name`, "Test Project" );
    ctx.app.webContents.send( "directorySelected", ctx.getTmpDir( "new-project" ) );
    await ctx.client.pause( 100 );
    await ctx.screenshot( "new-project-modal-populated" );
  });

  test( "app lands on Project Info screen after opening", async () => {
    await ctx.client.click( `${ S.MODAL_NEW_PROJECT } ${ S.MODAL_OK_BTN }` );
    await ctx.client.pause( 300 );
    expect( await ctx.client.isExisting( "#cInfo" ) ).toBeTruthy();
    await ctx.screenshot( "new-project-lands-on-info-screen" );
  });

  test( "Project Info screen has create and open suite buttons", async () => {
    expect( await ctx.client.isExisting( "#cInfoCreateBtn" ) ).toBeTruthy();
    // now available as no suites yet created
    expect( await ctx.client.isExisting( "#cInfoOpenBtn" ) ).not.toBeTruthy();
  });

  test( "app opens New Suite modal by clicking Create on Info page", async() => {
    await ctx.client.click( "#cInfoCreateBtn" );
    await ctx.client.pause( 100 );
    await ctx.screenshot( "new-suite-modal" );
    expect( await ctx.client.isExisting( S.MODAL_NEW_SUITE ) ).toBeTruthy();
  });

  test( "fill out New Suite modal form and submit", async() => {
    await ctx.client.setValue( `${ S.MODAL_NEW_SUITE } #title`, "Test Suite" );
    await ctx.client.pause( 100 );
    const fnamePreview = await ctx.client.getText( "#cNewSuiteModalFilenamePreview" );
    expect( fnamePreview ).toEqual( "test--suite.json" );
    await ctx.client.pause( 100 );
    await ctx.client.click( `${ S.MODAL_NEW_SUITE } ${ S.MODAL_OK_BTN }` );
    await ctx.client.pause( 500 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-suite-created" );
    //  .c-tab-group-suite .ant-tabs-tab:first-child
    //  .c-tab-group-suite .ant-tabs-tab:last-child

    // #cSuiteForm #title
    // #cSuiteForm #timeout
  });

  test( "modify suite form", async() => {
    await ctx.client.setValue( `#cSuiteForm #title`, "Test Suite Modified" );
    await ctx.client.setValue( `#cSuiteForm #timeout`, 70000 );
    await ctx.client.click( `#cSuiteFormChangeBtn` );
    await ctx.client.pause( 300 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-suite-form-modified" );
  });

  test( "go tab Targets", async() => {
    await ctx.client.click( `.c-tab-group-suite .ant-tabs-tab:first-child` );
    await ctx.client.pause( 500 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-suite-tab-targets" );
  });

});
