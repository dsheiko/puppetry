// @see https://webdriver.io/docs/api.html
// @see https://electronjs.org/spectron
const { Application } = require( "spectron" ),
      { join } = require( "path" ),
      fs = require( "fs" ),
      tmp = require( "tmp-promise" ),
      ROOT_PATH = join( __dirname, "..", "..", ".." ),
      shell = require( "shelljs" ),
      DIST_PATH = join( ROOT_PATH, "dist" ),
      SCREENSHOT_PATH = join( __dirname, "..", "screenshots" ),
      manifest = require( join( ROOT_PATH, "package.json" ) ),
      APP_PATH = process.platform === "win32" ? join( DIST_PATH, "win-unpacked", "puppetry.exe" ) :
        ( process.platform === "darwin" ? join( DIST_PATH, "mac", "puppetry.app", "Contents", "MacOS", "puppetry" )
          : join( DIST_PATH, "linux-unpacked", "puppetry" ) );

shell.config.fatal = true;

shell.mkdir( "-p" , SCREENSHOT_PATH );

function sprintfCount( num ) {
  return String( num + 100000 ).substr( 1 );
}

class Ctx {

  constructor() {
    this.app = null;
    this.tmpDir = {};
    this.ns = "";
    this.counter = 1;
  }

  async startApp() {
    this.app = new Application({
      path: APP_PATH,
      env: {
        PUPPETRY_CLEAN_START: true,
        PUPPETRY_SPECTRON: true
      },
      chromeDriverArgs: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ],
      webdriverOptions: {
        deprecationWarnings: false
      }
    });
    await this.app.start();
    await this.app.client.waitUntilWindowLoaded();
    this.client = this.app.client;
  }

  async stopApp() {
    await this.app.stop();
  }

  async screenshot( name ) {
    const dir = join( SCREENSHOT_PATH, this.ns ),
          buf = await this.app.browserWindow.capturePage();
    shell.mkdir( "-p" , dir );
    fs.writeFileSync( join( dir, `${ sprintfCount( this.counter++ ) }--${ name }.png` ), buf );
  }

  async waitUntilLayoutUpdates() {
    // wait until loading state
    await (await this.app.client.$( "#cLayout:not(.is-loading)" )).waitForExist();
    // give it time to finish the animation
    await this.app.client.pause( 300 );
  }

  async setAttribute( selector, attr, value ) {
    await this.app.client.execute( ( selector, attr, value ) => {
      const el = document.querySelector( selector );
      el.scrollIntoView();
      if ( typeof value === "undefined" ) {
        el.removeAttribute( attr );
        return;
      }
      el.setAttribute( attr, value );
    }, selector, attr, value );
  }

  /**
   * Emulate user-like toggle
   * @param {String} selector
   * @param {Boolean} toggle
   */
  async toggleCheckbox( selector, toggle ) {

    await this.app.client.execute( ( selector, toggle ) => {
      const el = document.querySelector( selector );
      el.scrollIntoView();
      if ( toggle && !el.parentNode.classList.contains( "ant-checkbox-checked" ) ) {
        el.parentNode.parentNode.click();
      }
      if ( !toggle && el.parentNode.classList.contains( "ant-checkbox-checked" ) ) {
        el.parentNode.parentNode.click();
      }
      return [ el.parentNode.tagName, el.parentNode.parentNode.tagName ];
    }, selector, toggle );
  }

  async setValue( selector, value ) {
    await this.app.client.execute( ( selector, value ) => {
      const el = document.querySelector( selector );
      el.scrollIntoView();
      el.value = value;
    }, selector, value );
  }

  async click( selector ) {
    await this.app.client.execute( ( selector ) => {
      const el = document.querySelector( selector );
      el.scrollIntoView();
      el.click();
    }, selector );
  }

//  async type( selector, value ) {
//      // reset the input, because despite docs https://webdriver.io/docs/api/element/setValue.html
//      // .client.setValue works like addValue
//      await this.app.client.execute( ( selector ) => {
//        const el = document.querySelector( selector );
//        // When it's INPUT_NUMBER reset is 0
//        el.setAttribute( "value", el.classList.contains( "ant-input-number-input" ) ? 0 : "" );
//      }, selector );
//      return await this.app.client.setValue( selector, value );
//  }

  /**
   * Emulate change select value for Ant.Design select
   * @param {type} selector
   * @param {type} value
   */
  async select( selector, value ) {
    expect( await ( await this.app.client.$( selector ) ).isExisting() ).toBeOk( `selector=${ selector }` );  
    // Here what we do:
    // 1) find select parent node and click on it open
    // 2) find hash to match open global modal with dropdown menu
    // 3) find list if options (dropdown menu items)
    // 4) find one matching given value
    // 5) click on it
    const debug = await this.app.client.execute( ( selector, value ) => {
      try {
        const el = document.querySelector( selector ),
              oValue = value.trim();
        el.scrollIntoView();
        el.click();
        const hash = el.querySelector( "[aria-controls]" ).getAttribute( "aria-controls" ),
              list = Array.from( document.querySelectorAll( `[id="${ hash }"] .ant-select-dropdown-menu-item` ) ),
              optionNode = list.find( el => {
                const span = el.querySelector( "span" );
                // Target/Method selectors have ReactElements inside options
                if ( span ) {
                  return span.dataset.keyword.trim() === oValue;
                }
                return el.textContent.trim() === oValue;
              });

        optionNode && optionNode.click();
        return { hash, optionNode, value, options: list.map( el => el.tagName ) };
      } catch ( e ) {
        return { exception: e };
      }

    }, selector, value );

    await this.app.client.pause( 200 );
  }

  // Well the problem is user
//  async select( selector, value ) {
//    await this.app.client.execute( ( selector ) => {
//      document.querySelector( selector ).scrollIntoView();
//    }, selector );
//    await this.app.client.click( `${ selector } .ant-select-selection--single` );
//    await this.app.client.pause( 100 );
//    await this.app.client.setValue( `${ selector } input.ant-select-search__field`, value );
//    await this.app.client.keys([ "Enter" ]);
//    await this.app.client.pause( 100 );
//  }

  async expectMenuItemsAvailable( spec ) {
    const keys = Object.keys( spec );
    for ( const selector of keys ) {
      const isDisabled = await this.hasClass( selector, "ant-menu-item-disabled" );     
      expect( !isDisabled ).toBeEqual( spec[ selector ], `Menu.Item=${ selector }` );
    }
  }

  async hasClass( selector, className ) {
    expect( await ( await this.app.client.$( selector ) ).isExisting() ).toBeOk( `selector=${ selector }` );    
    return ( await this.app.client.execute( ( selector, className ) => {
      const el = document.querySelector( selector );
      return el.classList.contains( className );
    }, selector, className ) ) ;
  }

  async getTagName( selector ) {
    return ( await this.app.client.execute( ( selector ) => {
      return document.querySelector( selector ).tagName;
    }, selector ) );
  }

  async boundaryError() {
    return await ( await this.app.client.$( ".critical-error" ) ).isExisting();
  }

 async checkLogErrors() {
   const logs = await this.app.client.getRenderProcessLogs();
    logs.forEach( log => {
      if ( log.level === "SEVERE" ) {
        console.error( "console.error", log.message );
        if ( log.message.includes( "MaxListenersExceededWarning:" ) ) {
          return;
        }
        expect( log.level ).not.toEqual( "SEVERE" );
      }
    });
 }

// Under construction
 async hover( selector, duration = 500 ) {
   const { x, y } = ( await this.app.client.execute( ( selector ) => {
      const el = document.querySelector( selector ),
            { x, y, width, height } = el.getBoundingClientRect();
            return { x: x + Math.ceil( width ), y: y + Math.ceil( height ) };
    }, selector ) ).value;

    await this.app.client.actions([{
      "type": "pointer",
      "id": "finger1",
      "parameters": { "pointerType": "mouse" },
      "actions": [
        { "type": "pointerMove", "duration": 0, "x": x, "y": y },
        { "type": "pointerDown", "button": 0 },
        { "type": "pause", "duration": duration },
        { "type": "pointerUp", "button": 0 }
      ]
    }]);

 }



  createTmpDir( key ) {
    this.tmpDir[ key ] = tmp.dirSync().name;
  }

  getTmpDir( key ) {
    return this.tmpDir[ key ];
  }

  cleanupTmpDirs() {
    Object.values( this.tmpDir ).forEach( dir => shell.rm( "-rf" , dir ) );
    this.tmpDir = {};
  }

}

/**
 * Helper
 * @param {Boolean} pass
 * @param {String} errorMsg
 * @param {String} [vsMsg]
 * @returns {Object}
 */
function expectReturn( pass, errorMsg, vsMsg = null ) {
  const negativeErrorMsg = vsMsg || errorMsg.replace( " expected ", " not expected " );
  return {
    message: () => pass ? negativeErrorMsg : errorMsg,
    pass
  };
}

expect.extend({
  /**
   * Assert value is truthy
   * @param {Boolean} received
   * @param {String} source
   * @returns {Object}
   */
  toBeOk( received, source ) {
    const pass = Boolean( received );
    return expectReturn( pass,
      `[${ source }] expected to be available`,
      `[${ source }] expected to be not available` );
  },

  /**
   * Assert values equal
   * @param {String|Number|Boolean} received
   * @param {String|Number|Boolean} value
   * @param {String} source
   * @returns {Object}
   */
  toBeEqual( received, value, source ) {
    const pass = received === value;
    return expectReturn( pass,
      `[${ source }] expected ${ JSON.stringify( received ) } to equal ${ JSON.stringify( value ) }`,
      `[${ source }] expected ${ JSON.stringify( received ) } not to equal ${ JSON.stringify( value ) }` );
  }

});

exports.Ctx = Ctx;