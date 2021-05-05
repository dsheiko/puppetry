// @see https://webdriver.io/docs/api.html
// @see https://github.com/electron-userland/spectron
const { Ctx } = require( "../lib/bootstrap" ),
      S = require( "../lib/constants" ),
      { validate } = require( "bycontract" ),
      { schema } = require( "../../component/Schema/schema.jsx" ),
      ctx = new Ctx(),
      cfid = ( id ) => `#cCommandForm [id="${ id }"]`,
      FIX_TARGET = "SEL_FOO";

jest.setTimeout( 50000 );

function isObject( val ) {
  return val.constructor === Object;
}

async function setActionInputValue( id, value, input ) {
  const selector = cfid( id );
  if ( value === null ) {
    return;
  }

  await (await ctx.client.$( selector )).waitForExist();
  try {
    switch ( input ) {
      case "INPUT":
      case "INPUT_NUMBER":
        return await ( await ctx.client.$( selector ) ).setValue( value );
      case "SELECT":
        await ctx.select( selector, value );
        return await ctx.client.pause( 300 );
      case "CHECKBOX":
        return await ctx.toggleCheckbox( selector, value );
      case "SWITCH":
        await ctx.click( selector );
        // needs time to finish transaction
        return await ctx.client.pause( 300 );
      case "default":
        console.error( new Error( `Invalid input type "${ input }" in "${ selector }"` ) );
    }
  } catch ( e ) {
    throw new Error( `exception for ${ id }(${ input }): ${ e.message }` );
  }
}

async function fillEnabled( enabledKey, testTypes, localTest ) {
  const [ enabled, param ] = enabledKey.split( "." );
  await setActionInputValue( `assert._enabled.${ param }`, true, "SWITCH" );
  await setActionInputValue( `assert.${ param }`, localTest[ param ], testTypes[ param ] );
}

/**
 *
 * @param {Object} testTypes
 * @param {Object} testFix
 * @param {String} scope - "params" | "assert"
 */
async function fillActionInput( testTypes, testFix, scope ) {
  if ( typeof testFix[ scope ] === "undefined" || typeof testTypes[ scope ] === "undefined" ) {
    return;
  }
  const pairs = Object.entries( testFix[ scope ] );

  if ( "assert" in testTypes && "assert" in testFix ) {
    const enabledKey = Object.keys( testTypes.assert ).find( key => key.startsWith( "_enabled" ) );
    if ( enabledKey ) {
      return await fillEnabled( enabledKey, testTypes.assert, testFix.assert );
    }

  }
  for ( const pair of pairs ) {
    const [ method, val ] = pair;
    if ( typeof testTypes[ scope ][ method ] !== "undefined" ) {
      await setActionInputValue( `${ scope }.${ method }`, val, testTypes[ scope ][ method ] );
    }
  }
}

function getFieldlistToReset( spec ) {
  return [ "params", "assert" ].reduce(( carry, type ) => {
    if ( typeof spec[ type ] === "undefined" ) {
      return carry;
    }
    return carry.concat( Object.keys( spec[ type ] )
      .filter( method => method !== "_enabled" )
      .map( method => `${ type }.${ method }` ) );
  }, [] );
}

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
    expect( await ( await ctx.client.$( "#cWelcome" ) ).isExisting() ).toBeTruthy();
    await (await ctx.client.$( "#cWelcomeNewProjectBtn" )).click();
    await (await ctx.client.$( S.MODAL_NEW_PROJECT )).waitForExist();
    await ctx.screenshot( "new-project-modal-opened" );
  });

  test( "app populates New Project modal", async () => {
    ctx.createTmpDir( "new-project" );
    await ( await ctx.client.$( `${ S.MODAL_NEW_PROJECT } #name` ) ).setValue( "Test Project" );
    await ( await ctx.client.$( `${ S.MODAL_NEW_PROJECT } #suiteTitle` ) ).setValue( "Test Suite" );
    ctx.app.webContents.send( "directorySelected", ctx.getTmpDir( "new-project" ), "inNewProjectModal" );
    await ctx.client.pause( 100 );
    await ctx.screenshot( "new-project-modal-populated" );
  });

  test( "app lands on New Suite page", async () => {
    await (await ctx.client.$( `${ S.MODAL_NEW_PROJECT } ${ S.MODAL_OK_BTN }` )).click();
    await (await ctx.client.$( S.PANEL_SUITE_TABGROUP )).waitForExist();
    await ctx.screenshot( "newly-created-suite" );
  });

  test( "go tab OPTIONS", async() => {
    await (await ctx.client.$( `${ S.PANEL_SUITE_TABGROUP } .ant-tabs-tab:nth-child(3)` )).click();
    await (await ctx.client.$( `#cSuiteForm #title` )).waitForExist();
  });

  test( "change suite options", async() => {
    await ( await ctx.client.$( `#cSuiteForm #title` ) ).setValue( "Test Suite Modified" );
    await ( await ctx.client.$( `#cSuiteForm #timeout` ) ).setValue( 70000 );
    await (await ctx.client.$( `#cSuiteFormChangeBtn` )).click();
    await ctx.client.pause( 300 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "suite-form-modified" );
  });

  test( "go tab TARGETS", async() => {
    await (await ctx.client.$( `${ S.PANEL_SUITE_TABGROUP } .ant-tabs-tab:nth-child(1)` )).click();
    await (await ctx.client.$( `#cTargetTable .input--target` )).waitForExist();
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "goto-tab--targets" );
  });

  test( "add a target", async() => {
    expect( await ( await ctx.client.$( "#cTargetTable .ant-form-item-control input.input--target" ) ).isExisting() ).toBeTruthy();
    expect( await ( await ctx.client.$( "#cTargetTable .ant-form-item-control input.input--selector" ) ).isExisting() ).toBeTruthy();
    await ( await ctx.client.$( "#cTargetTable .ant-form-item-control input.input--target" ) ).setValue( FIX_TARGET );
    await ( await ctx.client.$( "#cTargetTable .ant-form-item-control input.input--selector" ) ).setValue( ".foo" );
    await (await ctx.client.$( `#cTargetTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` )).click();
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-target" );
  });

  test( "go tab GROUPS", async() => {
    await (await ctx.client.$( `${ S.PANEL_SUITE_TABGROUP } .ant-tabs-tab:nth-child(2)` )).click();
    await (await ctx.client.$( "#cGroupTable .input--title > input" )).waitForExist();
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "goto-tab--groups" );
  });

  test( "add a group", async() => {
    await ( await ctx.client.$( "#cGroupTable .input--title > input" ) ).setValue( "Test group" );
    await (await ctx.client.$( `#cGroupTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` )).click();
    await (await ctx.client.$( "#cTestTable .input--title > input" )).waitForExist();
  });


  test( "add a test", async() => {
    await ( await ctx.client.$( "#cTestTable .input--title > input" ) ).setValue( "Test" );
    await (await ctx.client.$( `#cTestTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` )).click();
    await ctx.client.pause( 300 );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-test" );
  });

  
  for (const scope of [ "page", "element" ] ) {
    for (const sPair of Object.entries( schema[ scope ] ) ) {

      const [ method, config ] = sPair;

//      if ( method !== "assertNodeCount" ) {
//        continue;
//      }

      if ( typeof config.testTypes === "undefined" ) {
        continue;
      }

      if ( typeof config.testTypes !== "undefined" && !isObject( config.testTypes ) ) {
        throw new Error( `${ scope }.method has invalid "testTypes" property type, must be object literal` );
      }

      test( `add a test step ${ scope }.${ method } `, async() => {
        const METHOD_SELECTOR = scope === "page"
          ? `.select--page-method`
          : `.select--element-method`;

        // ADD COMMAND
        await (await ctx.client.$( `[id="cCommandTableAddBtn"]` )).click();
        await (await ctx.client.$( "#cCommandForm .select--target" )).waitForExist()
        // SELECT PAGE/TARGET
        await ctx.select( "#cCommandForm .select--target", scope === "page" ? "page" : FIX_TARGET );
        // METHOD selector is disabled (input:disabled) until any value in TARGET selector picked
        await (await ctx.client.$( `#cCommandForm ${ METHOD_SELECTOR }.ant-select-enabled` )).waitForExist();

        // SELECT METHOD
        await ctx.select( `#cCommandForm ${ METHOD_SELECTOR }`, method );
        // As soon as any value in METHOD selector picked we get description and .command-form sections into the view
        await (await ctx.client.$( "#cCommandForm .command-form" )).waitForExist();


        expect( await ctx.boundaryError() ).toBeFalsy();

        // EXPAND OPTIONS if any
        if ( await ( await ctx.client.$( S.TEST_STEP_COLLAPSABLE_ITEM ) ).isExisting() ) {
          await ctx.click( S.TEST_STEP_COLLAPSABLE_ITEM );
          await (await ctx.client.$( S.TEST_STEP_COLLAPSABLE_EXPANDED )).waitForExist()
        }

        if ( typeof config.testTypes === "undefined" ) {
          await ctx.screenshot( `command--${ method }--empty` );
          // CLOSE MODAL
          await ctx.click( `#cCommandModal .btn--modal-command-cancel` );
          await ctx.client.pause( 300 );
          return;
        }


        // RESET the form
//        const resetFields = getFieldlistToReset( config.testTypes, config.test );
//        resetFields && ctx.app.webContents.send( "resetFormEvent", resetFields );
//        await ctx.client.pause( 300 );

        // FILL OUT THE FORM

          for ( const fixture of config.test ) {
            try {
              await fillActionInput( config.testTypes, fixture, "params" );
              await fillActionInput( config.testTypes, fixture, "assert" );
            } catch ( ex ) {
              console.warn( `Exception at ${ scope }.${ method }: ${ ex.message }` );
            }
          }


        //await ctx.client.pause( 200 );
        await ctx.screenshot( `command--${ method }--filled` );

        // CLICK SAVE
        await ctx.click( S.TEST_STEP_MODAL_OK );

        expect( await ( await ctx.client.$( `#cCommandModal .ant-form-item-control.has-error` ) ).isExisting() )
          .not.toBeOk( `Errored form fields for ${ scope }.${ method }` );

        await ctx.client.pause( 300 );

      });

    }
  }

  test( `Command listing populated`, async() => {
    await ctx.screenshot( `command-listing--added` );
  });



});
