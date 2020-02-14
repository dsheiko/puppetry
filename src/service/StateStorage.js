import { STORAGE_KEY_STATE } from "constant";

const defaultState = {
  "ConnectOptions": {
    browserWSEndpoint: ""
  },
  "BrowserOptions": {
    product: "headless",
    headless: true,
    incognito: true,
    devtools: false,
    chromeExtDirectory: "",
    browseDirectoryValidateStatus: "",
    browseDirectoryValidateMessage: "",
    chromeExtLauncherArgs: ""
  },
  "ChromeArguments": {
    launcherArgs: "",
    ignoreHTTPSErrors: false
  },
  "FirefoxArguments": {
    launcherArgs: "",
    ignoreHTTPSErrors: false
  },
  "ChromeExecutablePath" : {
    executablePath: ""
  },
  "FirefoxExecutablePath" : {
    executablePath: ""
  }
};

export default class StateStorage {

  constructor( ns )   {
    this.ns = ns;
    if ( typeof defaultState[ this.ns ] === "undefined" ) {
      throw new Error( `Namespace ${ this.ns } not available in the storage` );
    }
  }

  set( update ) {
    const state = this.getAll();
    state[ this.ns ] = Object.assign( {}, state[ this.ns ], update );
    localStorage.setItem( STORAGE_KEY_STATE, JSON.stringify( state ) );
  }

  getAll() {
     const jsonString = localStorage.getItem( STORAGE_KEY_STATE );
     return jsonString ? JSON.parse( jsonString ) : defaultState;
  }

  get() {
    const state = this.getAll();
    return typeof state[ this.ns ] !== "undefined" ? state[ this.ns ] : defaultState[ this.ns ];
  }
};