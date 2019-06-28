const puppeteer = require( "puppeteer" ),
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
   */
  async setup() {
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

    if ( launcherArgs ) {
      options.args = launcherArgs.split( " " );
    }

    this.browser = await puppeteer.launch( options  );
    this.context = await this.browser.createIncognitoBrowserContext();
    this.page = await this.context.newPage();
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