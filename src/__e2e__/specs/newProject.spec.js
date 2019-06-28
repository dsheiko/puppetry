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
    expect( await ctx.client.isExisting( S.PANEL_SUITE_TABGROUP ) ).toBeTruthy();
    await ctx.screenshot( "newly-created-suite" );
  });

  test( "go tab OPTIONS", async() => {
    await ctx.client.click( `${ S.PANEL_SUITE_TABGROUP } .ant-tabs-tab:nth-child(3)` );
    await ctx.client.pause( 300 );
    expect( await ctx.client.isExisting( `#cSuiteForm #title` ) ).toBeTruthy();
  });

  test( "change suite options", async() => {
    await ctx.client.setValue( `#cSuiteForm #title`, "Test Suite Modified" );
    await ctx.client.setValue( `#cSuiteForm #timeout`, 70000 );
    await ctx.client.click( `#cSuiteFormChangeBtn` );
    await ctx.client.pause( 300 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "suite-form-modified" );
  });

  test( "go tab TARGETS", async() => {
    await ctx.client.click( `${ S.PANEL_SUITE_TABGROUP } .ant-tabs-tab:nth-child(1)` );
    await ctx.client.pause( 500 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "goto-tab--targets" );
  });

  test( "add a target", async() => {
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

  test( "go tab GROUPS", async() => {
    await ctx.client.click( `${ S.PANEL_SUITE_TABGROUP } .ant-tabs-tab:nth-child(2)` );
    await ctx.client.pause( 500 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "goto-tab--groups" );
  });

  test( "add a group", async() => {
    expect( await ctx.client.isExisting( "#cGroupTable .input--title > input" ) ).toBeTruthy();
    await ctx.client.setValue( "#cGroupTable .input--title > input", "Test group" );
    await ctx.client.pause( 200 );
    await ctx.client.click( `#cGroupTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-suite" );
  });


  test( "add a test", async() => {
    await ctx.client.pause( 200 );
    expect( await ctx.client.isExisting( "#cTestTable .input--title > input" ) ).toBeTruthy();
    await ctx.client.setValue( "#cTestTable .input--title > input", "Test" );
    await ctx.client.pause( 200 );
    await ctx.client.click( `#cTestTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-test" );
  });


  for (const sPair of Object.entries( schema.page ) ) {
    const [ method, config ] = sPair;

    test( `add a test step page.${ method } `, async() => {
      // ADD COMMAND
      await ctx.client.click( `#cCommandTableAddBtn` );
      await ctx.client.pause( 200 );
      // SELECT PAGE
      await ctx.select( "#cCommandForm .select--target", "page" );
      await ctx.client.pause( 200 );
      // SELECT METHOD
      await ctx.select( "#cCommandForm .select--page-method", method );
      await ctx.client.pause( 200 );

      expect( await ctx.boundaryError() ).toBeFalsy();

      // EXPAND OPTIONS if any
      if (  await ctx.client.isExisting( S.TEST_STEP_COLLAPSABLE_ITEM ) ) {
        await ctx.client.click( S.TEST_STEP_COLLAPSABLE_ITEM );
        await ctx.client.pause( 200 );
      }

      await ctx.screenshot( `new-command--select-${ method }` );

      if ( !config.test ) {
        // CLOSE MODAL
        await ctx.client.click( `#cCommandModal .btn--modal-command-cancel` );
        await ctx.client.pause( 200 );
        return;
      }
      // FILL OUT THE FORM
      for ( const pair of Object.entries( config.test.params ) ) {
        const sel = `#cCommandModal [id="params.${ pair[ 0 ] }"]`;
        await ctx.client.setValue( sel, pair[ 1 ] );
      }
      // CLICK SAVE
      await ctx.client.click( `#cCommandModal .btn--modal-command-ok` );

      await ctx.client.pause( 200 );
      await ctx.screenshot( `new-command--added-${ method }` );

    });

  }



  test( `select target: ${ FIX_TARGET }`, async() => {
    // ADD COMMAND
    await ctx.client.click( `#cCommandTableAddBtn` );
    await ctx.client.pause( 200 );
    // SELECT TARGET
    await ctx.select( "#cCommandForm .select--target", FIX_TARGET );
    await ctx.client.pause( 200 );
    expect( await ctx.boundaryError() ).toBeFalsy();
  });

  Object.keys( schema.element ).forEach( method => {
    // SELECT METHOD
    test( `select element method: ${ method }`, async() => {
      await ctx.select( "#cCommandForm .select--element-method", method );
      await ctx.client.pause( 200 );
      expect( await ctx.boundaryError() ).toBeFalsy();
      await ctx.screenshot( `new-command--select-${ method }` );
    });
  });

});
