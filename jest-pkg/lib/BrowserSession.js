const puppeteer = require( "puppeteer" );

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
    this.browser = await puppeteer.launch(
       // when called like DEBUG=true jest open in a browser
       process.env.RUN_IN_BROWSER
        ? {
            headless: false,
            slowMo: 40,
            devtools: false
          }
        : {
          headless: true,
          devtools: false
        }
    );
    this.page = await this.browser.newPage();
  }

  /**
   * Close browser on teardown
   */
  async teardown() {
    this.browser.close();
  }
}

module.exports = new BrowserSession();