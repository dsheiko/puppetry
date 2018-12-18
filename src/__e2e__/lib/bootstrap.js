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
    fs.writeFileSync( join( dir, `${ this.counter++ }--${ name }.png` ), buf );
  }

  async waitUntilLayoutUpdates() {
    // wait until loading state
    await this.app.client.waitForExist( "#cLayout:not(.is-loading)" );
    // give it time to finish the animation
    await this.app.client.pause( 300 );
  }

  async setAttribute( selector, attr, value ) {
    await this.app.client.execute( ( selector, attr, value ) => {
      const el = document.querySelector( selector );
      if ( typeof value === "undefined" ) {
        el.removeAttribute( attr );
        return;
      }
      el.setAttribute( attr, value );
    }, selector, attr, value );
  }

  async expectMenuItemsAvailable( spec ) {
    const keys = Object.keys( spec );
    for ( const selector of keys ) {
      const isDisabled = await this.hasClass( selector, "ant-menu-item-disabled" );
      expect( !isDisabled ).toBeEqual( spec[ selector ], `Menu.Item=${ selector }` );
    }
  }

  async hasClass( selector, className ) {
    expect( await this.app.client.isExisting( selector ) ).toBeOk( `selector=${ selector }` );
    return ( await this.app.client.execute( ( selector, className ) => {
      const el = document.querySelector( selector );
      return el.classList.contains( className );
    }, selector, className ) ).value;
  }

  async boundaryError() {
    return await this.app.client.isExisting( ".critical-error" );
  }

 async checkLogErrors() {
   const logs = await this.app.client.getRenderProcessLogs();
    logs.forEach( log => {
      if ( log.level === "SEVERE" ) {
        console.error( "console.error", log.message );
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

  async select( selector, value ) {
    await this.app.client.click( `${ selector } .ant-select-selection--single` );
    await this.app.client.pause( 100 );
    await this.app.client.setValue( `${ selector } input.ant-select-search__field`, value );
    await this.app.client.keys([ "Enter" ]);
    await this.app.client.pause( 100 );
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
      `[${ source }] expected ${ JSON.stringify( received ) } to be truthy`,
      `[${ source }] expected ${ JSON.stringify( received ) } to be falsy` );
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