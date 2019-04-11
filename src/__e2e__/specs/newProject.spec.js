const { Ctx } = require( "../lib/bootstrap" ),
      S = require( "../lib/constants" ),
      { schema } = require( "../../component/Schema/schema.jsx" ),
      ctx = new Ctx(),
      FIX_TARGET = "SEL_FOO";

jest.setTimeout( 50000 );


describe( "New Project", () => {

  beforeAll( async () => {
    await ctx.startApp();
    ctx.ns = "new-project";
  });

  afterAll( async () => {
    ctx.cleanupTmpDirs();
    await ctx.stopApp();
  });

  afterEach( async() => {
    await ctx.checkLogErrors();
  });

  test( "app opens New Project modal", async () => {
    expect( await ctx.client.isExisting( "#cWelcome" ) ).toBeTruthy();
    await ctx.client.click( "#cWelcomeNewProjectBtn" );
    await ctx.client.pause( 300 );
    await ctx.screenshot( "new-project-modal-opened" );
    // New Project modal opens
    expect( await ctx.client.isExisting( S.MODAL_NEW_PROJECT ) ).toBeTruthy();
  });

  test( "app populates New Project modal", async () => {
    ctx.createTmpDir( "new-project" );
    await ctx.client.setValue( `${ S.MODAL_NEW_PROJECT } #name`, "Test Project" );
    await ctx.client.setValue( `${ S.MODAL_NEW_PROJECT } #suiteTitle`, "Test Suite" );
    ctx.app.webContents.send( "directorySelected", ctx.getTmpDir( "new-project" ) );
    await ctx.client.pause( 100 );
    await ctx.screenshot( "new-project-modal-populated" );
  });

  test( "app lands on New Suite page", async () => {
    await ctx.client.click( `${ S.MODAL_NEW_PROJECT } ${ S.MODAL_OK_BTN }` );
    await ctx.client.pause( 600 );
    expect( await ctx.client.isExisting( "#cSuiteForm" ) ).toBeTruthy();
    await ctx.screenshot( "newly-created-suite" );
  });

// Obsolete case since  1.0.7
//  test( "app lands on Project Info screen after opening", async () => {
//    await ctx.client.click( `${ S.MODAL_NEW_PROJECT } ${ S.MODAL_OK_BTN }` );
//    await ctx.client.pause( 300 );
//    expect( await ctx.client.isExisting( "#cInfo" ) ).toBeTruthy();
//    await ctx.screenshot( "info-screen" );
//  });
//
//  test( "Project Info screen has create and open suite buttons", async () => {
//    expect( await ctx.client.isExisting( "#cInfoCreateBtn" ) ).toBeTruthy();
//    // now available as no suites yet created
//    expect( await ctx.client.isExisting( "#cInfoOpenBtn" ) ).not.toBeTruthy();
//  });
//
//  test( "app opens New Suite modal by clicking Create on Info page", async() => {
//    await ctx.client.click( "#cInfoCreateBtn" );
//    await ctx.client.pause( 100 );
//    await ctx.screenshot( "new-suite-modal" );
//    expect( await ctx.client.isExisting( S.MODAL_NEW_SUITE ) ).toBeTruthy();
//  });

  test( "app opens New Suite modal by clicking in main menu", async() => {
    // update component (move mouse cursor)
    expect( await ctx.client.isExisting( "#cMainMenuFile" ) ).toBeTruthy();
    expect( await ctx.client.isExisting( "#cMainMenuNewSuite" ) ).toBeTruthy();
    await ctx.client.moveToObject( "#cMainMenuFile" );
    await ctx.client.click( "#cMainMenuNewSuite" );
    await ctx.client.pause( 100 );
    await ctx.screenshot( "new-suite-modal" );
    expect( await ctx.client.isExisting( S.MODAL_NEW_SUITE ) ).toBeTruthy();
  });


  test( "fill out New Suite modal form and submit", async() => {
    await ctx.client.pause( 200 );
    await ctx.client.setValue( `${ S.MODAL_NEW_SUITE } #title`, "Second Suite" );
    await ctx.client.pause( 100 );
    const [ dump, fnamePreview ] = await ctx.client.getText( "#cNewSuiteModalFilenamePreview" );

    expect( fnamePreview ).toEqual( "second--suite.json" );
    await ctx.client.pause( 100 );
    await ctx.client.click( `${ S.MODAL_NEW_SUITE } ${ S.MODAL_OK_BTN }` );
    await ctx.client.pause( 500 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "suite-screen" );
  });

  test( "modify suite form", async() => {
    await ctx.client.setValue( `#cSuiteForm #title`, "Test Suite Modified" );
    await ctx.client.setValue( `#cSuiteForm #timeout`, 70000 );
    await ctx.client.click( `#cSuiteFormChangeBtn` );
    await ctx.client.pause( 300 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "suite-form-modified" );
  });

  test( "go tab Targets", async() => {
    await ctx.client.click( `#cMain .ant-tabs-tab:nth-child(1)` );
    await ctx.client.pause( 500 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "goto-tab--targets" );
  });

  test( "add a target", async() => {
    await ctx.client.click( `#cTargetTableAddBtn` );
    await ctx.client.pause( 200 );
    expect( await ctx.client.isExisting( "#cTargetTable .input--target > input" ) ).toBeTruthy();
    expect( await ctx.client.isExisting( "#cTargetTable .input--selector > input" ) ).toBeTruthy();
    await ctx.client.setValue( "#cTargetTable .input--target > input", FIX_TARGET );
    await ctx.client.setValue( "#cTargetTable .input--selector > input", ".foo" );
    await ctx.client.pause( 200 );
    await ctx.client.click( `#cTargetTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-target" );
  });

  test( "go tab Groups", async() => {
    await ctx.client.click( `#cMain .ant-tabs-tab:nth-child(2)` );
    await ctx.client.pause( 500 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "goto-tab--groups" );
  });

  test( "add a group", async() => {
    await ctx.client.click( `#cGroupTableAddBtn` );
    await ctx.client.pause( 200 );
    expect( await ctx.client.isExisting( "#cGroupTable .input--title > input" ) ).toBeTruthy();
    await ctx.client.setValue( "#cGroupTable .input--title > input", "Test group" );
    await ctx.client.pause( 200 );
    await ctx.client.click( `#cGroupTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-suite" );
  });

  test( "expand group", async() => {
    if ( !await ctx.client.isExisting( `#cTestTableAddBtn` ) ) {
      await ctx.client.click( `#cGroupTable ${ S.EDITABLE_ROW_EXPAND_ICON }` );
      await ctx.screenshot( "group-expanded" );
    }
  });

  test( "add a test", async() => {
    await ctx.client.click( `#cTestTableAddBtn` );
    await ctx.client.pause( 200 );
    expect( await ctx.client.isExisting( "#cTestTable .input--title > input" ) ).toBeTruthy();
    await ctx.client.setValue( "#cTestTable .input--title > input", "Test" );
    await ctx.client.pause( 200 );
    await ctx.client.click( `#cTestTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-test" );
  });

  test( "expand test", async() => {
    if ( !await ctx.client.isExisting( `#cCommandTableAddBtn` ) ) {
      await ctx.client.click( `#cTestTable ${ S.EDITABLE_ROW_EXPAND_ICON }` );
      await ctx.screenshot( "test-expanded" );
      await ctx.client.pause( 200 );
    }
  });

  test( "add a command", async() => {
    await ctx.client.click( `#cCommandTableAddBtn` );
    await ctx.client.pause( 200 );

  });

  test( "select target: page", async() => {
    await ctx.select( "#cCommandForm .select--target", "page" );
    await ctx.client.pause( 200 );
    expect( await ctx.boundaryError() ).toBeFalsy();
  });


  Object.keys( schema.page ).forEach( method => {
    test( `select page method: ${ method }`, async() => {
      await ctx.select( "#cCommandForm .select--page-method", method );
      await ctx.client.pause( 200 );
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( `new-command--select-${ method }` );
    });
  });

  test( `select target: ${ FIX_TARGET }`, async() => {
    await ctx.select( "#cCommandForm .select--target", FIX_TARGET );
    await ctx.client.pause( 200 );
    expect( await ctx.boundaryError() ).toBeFalsy();
  });

  Object.keys( schema.element ).forEach( method => {
    test( `select element method: ${ method }`, async() => {
      await ctx.select( "#cCommandForm .select--element-method", method );
      await ctx.client.pause( 200 );
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( `new-command--select-${ method }` );
    });
  });

});
