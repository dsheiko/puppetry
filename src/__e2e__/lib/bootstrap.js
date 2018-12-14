const { Application } = require( "spectron" ),
      { join } = require( "path" ),
      fs = require( "fs" ),
      tmp = require( "tmp-promise" ),
      ROOT_PATH = join( __dirname, "..", "..", ".." ),
      shell = require( "shelljs" ),
      DIST_PATH = join( ROOT_PATH, "dist" ),
      manifest = require( join( ROOT_PATH, "package.json" ) ),
      APP_PATH = process.platform === "win32" ? join( DIST_PATH, "win-unpacked", "puppetry.exe" ) :
        ( process.platform === "darwin" ? join( DIST_PATH, "mac", "puppetry.app" )
          : join( DIST_PATH, "linux-unpacked", "puppetry" ) );

shell.config.fatal = true;

class Ctx {

  constructor() {
    this.app = null;
    this.tmpDir = {};
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
    const buf = await this.app.browserWindow.capturePage();
    fs.writeFileSync( join( __dirname, "..", "screenshots", `${ name }.png` ), buf );
  }

  async waitUntilLayoutUpdates() {
    // wait until loading state
    await this.app.client.waitForExist( "#cLayout:not(.is-loading)" );
    // give it time to finish the animation
    await this.app.client.pause( 300 );
  }

  async setBrowseDirectory( dirKey ) {
    await this.app.client.execute(( dir ) => {
      const el = document.getElementById( "cBrowseDirectoryInput" );
      el.removeAttribute( "disabled" );
      el.setAttribute( "value", dir );
    }, this.getTmpDir( dirKey ) );
  }

  async boundaryError() {
    return await this.app.client.isExisting( ".critical-error" );
  }

  setupTmpDir( key ) {
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