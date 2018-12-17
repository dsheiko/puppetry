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
        PUPPETRY_CLEAN_START: true
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

exports.Ctx = Ctx;