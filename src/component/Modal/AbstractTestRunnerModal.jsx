import AbstractComponent from "component/AbstractComponent";
import StateStorage from "service/StateStorage";


export default class AbstractTestRunnerModal extends AbstractComponent {

  getBrowserOptions() {
    const storage = new StateStorage( this.constructor.name, sessionStorage );
    // Browser options tab is not shown
    if ( this.refBrowserOptions.current === null ) {
      return storage.get() || {
        incognito: true,
        "puppeteer.connect": {
          ignoreHTTPSErrors: true,
          browserWSEndpoint: null
        },
        "puppeteer.launch": {
          args: [],
          devtools: false,
          headless: true,
          slowMo: 30,
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
    // if ( options.product === "firefox" && !options.executablePath.trim().length ) {
    //   this.setState({ loading: false,
    //     error: "You need to specify the path to Firefox executable in Browser Options" });
    //   return false;
    // }
    return true;
  }

}