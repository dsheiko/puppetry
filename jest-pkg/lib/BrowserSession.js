const puppeteer = process.env.PUPPETRY_DRIVER === "firefox" ? require( "puppeteer-firefox" ) : require( "puppeteer" ),
      createTargetMethods = require( "./BrowserSession/targetMethods" );

class BrowserSession {

  async navigate( page, waitUntil = "networkidle2" ) {
    await this.page.goto( page );
    if ( typeof waitUntil === "string" ) {
      await this.page.goto( page, { waitUntil } );
    }
    if ( typeof waitUntil === "function" ) {
      await waitUntil();
    }
  }

  /**
   * Obtain browser and page object on bootstrap
   * @param {Object} setupOptions
   */
  async setup( setupOptions ) {
    // when called like PUPPETEER_RUN_IN_BROWSER=true jest open in a browser
    const options = process.env.PUPPETEER_RUN_IN_BROWSER
      ? {
          headless: false,
          slowMo: 40,
          devtools: Boolean( process.env.PUPPETEER_DEVTOOLS )
        }
      : {
        headless: true,
        devtools: false
      },
    launcherArgs = process.env.PUPPETEER_LAUNCHER_ARGS;

    options.ignoreHTTPSErrors = setupOptions.ignoreHTTPSErrors || false;

    if ( launcherArgs ) {
      options.args = launcherArgs.split( " " );
    }

    this.browser = await puppeteer.launch( options  );
    if ( setupOptions.incognito ) {
      this.context = await this.browser.createIncognitoBrowserContext();
      this.page = await this.context.newPage();
    } else {
      this.page = await this.browser.newPage();
    }
    // launches 2 windows (one regular and one incognito)
    // but seems like cannot be fixed https://github.com/GoogleChrome/puppeteer/issues/4400
    this.target = createTargetMethods( this.page );
  }


  /**
   * Close browser on teardown
   */
  async teardown() {
    this.browser.close();
  }
}

module.exports = new BrowserSession();