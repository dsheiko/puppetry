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

  await ctx.client.waitForExist( selector );
  try {
    switch ( input ) {
      case "INPUT":
      case "INPUT_NUMBER":
        return await ctx.client.setValue( selector, value );
      case "SELECT":
        return await ctx.select( selector, value );
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
    expect( await ctx.client.isExisting( "#cWelcome" ) ).toBeTruthy();
    await ctx.client.click( "#cWelcomeNewProjectBtn" );
    await ctx.client.waitForExist( S.MODAL_NEW_PROJECT );
    await ctx.screenshot( "new-project-modal-opened" );
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
    await ctx.client.waitForExist( S.PANEL_SUITE_TABGROUP );
    await ctx.screenshot( "newly-created-suite" );
  });

//  test( "go tab OPTIONS", async() => {
//    await ctx.client.click( `${ S.PANEL_SUITE_TABGROUP } .ant-tabs-tab:nth-child(3)` );
//    await ctx.client.waitForExist( `#cSuiteForm #title` );
//    // expect( await ctx.client.isExisting( `#cSuiteForm #title` ) ).toBeTruthy();
//  });
//
//  test( "change suite options", async() => {
//    await ctx.client.setValue( `#cSuiteForm #title`, "Test Suite Modified" );
//    await ctx.client.setValue( `#cSuiteForm #timeout`, 70000 );
//    await ctx.client.click( `#cSuiteFormChangeBtn` );
//    await ctx.client.pause( 300 );
//    expect( await ctx.boundaryError() ).toBeFalsy();
//    await ctx.screenshot( "suite-form-modified" );
//  });
//
  test( "go tab TARGETS", async() => {
    await ctx.client.click( `${ S.PANEL_SUITE_TABGROUP } .ant-tabs-tab:nth-child(1)` );
    await ctx.client.waitForExist( `#cTargetTable .input--target` );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "goto-tab--targets" );
  });

  test( "add a target", async() => {
    expect( await ctx.client.isExisting( "#cTargetTable .input--target > input" ) ).toBeTruthy();
    expect( await ctx.client.isExisting( "#cTargetTable .input--selector > input" ) ).toBeTruthy();
    await ctx.client.setValue( "#cTargetTable .input--target > input", FIX_TARGET );
    await ctx.client.setValue( "#cTargetTable .input--selector > input", ".foo" );
    await ctx.client.click( `#cTargetTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "new-target" );
  });

  test( "go tab GROUPS", async() => {
    await ctx.client.click( `${ S.PANEL_SUITE_TABGROUP } .ant-tabs-tab:nth-child(2)` );
    await ctx.client.waitForExist( "#cGroupTable .input--title > input" );
    expect( await ctx.boundaryError() ).toBeFalsy();
    await ctx.screenshot( "goto-tab--groups" );
  });

  test( "add a group", async() => {
    await ctx.client.setValue( "#cGroupTable .input--title > input", "Test group" );
    await ctx.client.click( `#cGroupTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` );
    await ctx.client.waitForExist( "#cTestTable .input--title > input" );
    await ctx.screenshot( "new-group" );
  });


  test( "add a test", async() => {
    await ctx.client.setValue( "#cTestTable .input--title > input", "Test" );
    await ctx.client.click( `#cTestTable ${ S.EDITABLE_ROW_SUBMIT_BTN }` );
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
        await ctx.click( `#cCommandTableAddBtn` );
        await ctx.client.waitForExist( "#cCommandForm .select--target" );
        // SELECT PAGE/TARGET
        await ctx.select( "#cCommandForm .select--target", scope === "page" ? "page" : FIX_TARGET );
        // METHOD selector is disabled (input:disabled) until any value in TARGET selector picked
        await ctx.client.waitForExist( `#cCommandForm ${ METHOD_SELECTOR }.ant-select-enabled` );

        // SELECT METHOD
        await ctx.select( `#cCommandForm ${ METHOD_SELECTOR }`, method );
        // As soon as any value in METHOD selector picked we get description and .command-form sections into the view
        await ctx.client.waitForExist( "#cCommandForm .command-form" );


        expect( await ctx.boundaryError() ).toBeFalsy();

        // EXPAND OPTIONS if any
        if (  await ctx.client.isExisting( S.TEST_STEP_COLLAPSABLE_ITEM ) ) {
          await ctx.click( S.TEST_STEP_COLLAPSABLE_ITEM );
          await ctx.client.waitForExist( S.TEST_STEP_COLLAPSABLE_EXPANDED );
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

        expect( await ctx.client.isExisting( `#cCommandModal .ant-form-item-control.has-error` ) )
          .not.toBeOk( `Errored form fields for ${ scope }.${ method }` );

        await ctx.client.pause( 300 );

      });

    }
  }

  test( `Command listing populated`, async() => {
    await ctx.screenshot( `command-listing--added` );
  });


//  test( `select target: ${ FIX_TARGET }`, async() => {
//    // ADD COMMAND
//    await ctx.client.click( `#cCommandTableAddBtn` );
//    await ctx.client.pause( 500 );
//    // SELECT TARGET
//    await ctx.select( "#cCommandForm .select--target", FIX_TARGET );
//    await ctx.client.pause( 500 );
//    expect( await ctx.boundaryError() ).toBeFalsy();
//    await ctx.screenshot( "select target" );
//  });
//
//  Object.keys( schema.element ).forEach( method => {
//    // SELECT METHOD
//    test( `select element method: ${ method }`, async() => {
//      await ctx.select( "#cCommandForm .select--element-method", method );
//      await ctx.client.pause( 500 );
//      expect( await ctx.boundaryError() ).toBeFalsy();
//      await ctx.screenshot( `new-command--select-${ method }` );
//    });
//  });

});
