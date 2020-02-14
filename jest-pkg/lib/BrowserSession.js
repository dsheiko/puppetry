const puppeteer = process.env.PUPPETRY_DRIVER === "firefox" ? require( "puppeteer-firefox" ) : require( "puppeteer" ),
      createTargetMethods = require( "./BrowserSession/targetMethods" ),
      ALLOWED_PRODUCTS = [ "chrome", "firefox" ];

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
   * @param {Object} projectOptions
   */
  async setup( projectOptions, suiteOptions ) {
    const launchOptions = projectOptions[ "puppeteer.launch" ],
          connectOptions = projectOptions[ "puppeteer.connect" ],
          incognito = projectOptions.incognito;

    if ( suiteOptions.setUserAgent ) {
      launchOptions.args.includes( "--no-sandbox" ) || launchOptions.args.push( "--no-sandbox" );
      launchOptions.args.includes( "--disable-setuid-sandbox" )
        || launchOptions.args.push( "--disable-setuid-sandbox" );
    }

    if ( suiteOptions.debug ) {
      launchOptions.headless = false;
      launchOptions.devtools = true;
    }

    if ( !launchOptions.headless ) {
      launchOptions.slowMo = 30;
    }

    try {
      if ( connectOptions.browserWSEndpoint ) {
        this.browser = await puppeteer.connect( connectOptions );
      } else {
        this.browser = await puppeteer.launch( launchOptions );
      }
      if ( incognito ) {
        this.context = await this.browser.createIncognitoBrowserContext();
        this.page = await this.context.newPage();
      } else {
        this.page = await this.browser.newPage();
      }

      // launches 2 windows (one regular and one incognito)
      // but seems like cannot be fixed https://github.com/GoogleChrome/puppeteer/issues/4400
      this.target = createTargetMethods( this.page );
    } catch( err ) {
      if ( connectOptions.browserWSEndpoint ) {
        console.error( `Failed to run puppeteer.connect() with options `, connectOptions );
      } else {
        console.error( `Failed to run puppeteer.launch() with options `, launchOptions );
      }
      console.error( err.message );
    }
  }



  /**
   * Close browser on teardown
   */
  async teardown() {
    this.browser.close();
  }
}

module.exports = new BrowserSession();