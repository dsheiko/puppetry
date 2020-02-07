const fs = require( "fs" );

const strategy = {

  linux: ( product ) => {
    try {
     return require( "which" ).sync( product );
    } catch ( e ) {
      console.warn( e );
      return null;
    }
  },

  macOs: ( product ) => {
    const regPathMap = {
            chrome: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            firefox: "/Applications/Firefox.app/Contents/MacOS/firefox-bin"
          },
          regPath = regPathMap[ product ],
          altPath = require( "userhome" )( regPath.slice( 1 ) );
    return fs.existsSync( regPath ) ? regPath : altPath;
  },

  windows: ( product ) => {
    const suffix = {
            chrome: "\\Google\\Chrome\\Application\\chrome.exe",
            firefox: "\\Mozilla Firefox\\firefox.exe"
          },
          prefixes = [
            process.env.LOCALAPPDATA,
            process.env.PROGRAMFILES,
            process.env[ "PROGRAMFILES(X86)" ]
          ];
    return prefixes
      .map(( pref ) => pref + suffix[ product ] )
      .find(( path ) => fs.existsSync( path ) );
  }
};

/**
 * @param {String} product - "google-chrome"|"firefox"
 */
export default function executablePath( product ) {
    switch ( true ) {
      case process.platform === "darwin":
        return strategy.macOs( product );
      case process.platform === "win32":
        return strategy.windows( product );
      default:
        return strategy.linux( product );
    }

}