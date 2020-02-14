import React from "react";
import AbstractComponent from "component/AbstractComponent";



export default class AbstractTestRunnerModal extends AbstractComponent {

  getBrowserOptions() {
    if ( this.refBrowserOptions.current === null ) {
      return {
        incognito: true,
        "puppeteer.launch": {
          devtools: false,
          headless: true,
          ignoreHTTPSErrors: false
        }
      };
    }
    return this.refBrowserOptions.current.getOptions();
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