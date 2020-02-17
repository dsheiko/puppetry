import React from "react";
import AbstractComponent from "component/AbstractComponent";
import StateStorage from "service/StateStorage";


export default class AbstractTestRunnerModal extends AbstractComponent {

  getBrowserOptions() {
    const storage = new StateStorage( this.constructor.name );

    // Browser options tab is not shown
    if ( this.refBrowserOptions.current === null ) {

      return this.storage.get() || {
        incognito: true,
        "puppeteer.connect": {
          ignoreHTTPSErrors: true,
          slowMo: 30,
          browserWSEndpoint: null
        },
        "puppeteer.launch": {
          devtools: false,
          headless: true,
          ignoreHTTPSErrors: false
        }
      };
    }

    const options = this.refBrowserOptions.current.getOptions();
    storage.set( options );
    return options;
  }

  checkExecutablePath( browserOptions ) {
    const options = browserOptions[ "puppeteer.launch" ];
    this.setState({ error: "" });
    if ( options.product === "chrome" && !options.executablePath.trim().length ) {
      this.setState({ loading: false,
        error: "You need to specify the path to Chrome executable in Browser Options" });
      return false;
    }
    if ( options.product === "firefox" && !options.executablePath.trim().length ) {
      this.setState({ loading: false,
        error: "You need to specify the path to Firefox executable in Browser Options" });
      return false;
    }
    return true;
  }

}