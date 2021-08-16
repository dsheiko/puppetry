
const { join, dirname } = require( "path" ),
      fs = require( "fs" ),
      os = require( "os" ),
      shell = require( "shelljs" ),
      fetch = require( "node-fetch" ),
      table = require( "text-table" ),
      { LocalStorage } = require( "node-localstorage" ),
      faker = require( "faker" ),
      localStorage = new LocalStorage( join( __dirname, "/../", "/storage" ) ),
      DIR_SCREENSHOTS_TRACE = ".trace";

let PATH_SCREENSHOTS = join( __dirname, "/../", "/screenshots"),
    PATH_REPORTS = join( __dirname, "/../", "/reports"),
    PATH_LOGS = join( __dirname, "/../", "/logs"),
    PATH_COMPARE = join( __dirname, "/../", "/snapshots"),
    SUITE_NAME = "",
    onceCounter = 0;

    /**
     * @see https://pptr.dev/#?product=Puppeteer&version=v1.5.0&show=api-class-page
     * @param {string} id
     * @param {string} parentId
     * @param {string} screenshotTitle
     * @param {Object} [options]
     * @returns {Object}
     */
const png = ( id, parentId, screenshotTitle, options = {} ) => {
        const FILENAME_RE = /[^a-zA-Z\d\-\_]/g,
              normalizedTitle = screenshotTitle.replace( FILENAME_RE, "-" ),
              normalizedSuiteTitle = SUITE_NAME.replace( FILENAME_RE, "-" ),
              fileName = `${ id }.${ normalizedTitle }.png`,
              path = join( PATH_SCREENSHOTS, normalizedSuiteTitle,
                parentId !== null ? parentId + "." + fileName : fileName );
        shell.mkdir( "-p" , dirname( path ) );
        return { path, ...options };
      },
      /**
       * @param {string} fileName
       * @returns {Object}
       */
      tracePng = ( fileName ) => {
        const path = join( PATH_SCREENSHOTS, DIR_SCREENSHOTS_TRACE, `${ fileName }.png` );
        shell.mkdir( "-p" , dirname( path ) );
        return { path };
      },

      generateTmpUploadFile = ( name, size ) => {
        const path = join( os.tmpdir(), name );
        fs.writeFileSync( path, Buffer.allocUnsafe( size * 1024 ) );
        return path;
      },


      performanceResourcesToTable = ( resources ) => {
        const arr = resources.map( r => ([ truncate( r.url, 90 ), r.type, bytesToString( r.length ) ]));
        return table([
          [ "URL", "Type", "Size" ],
          ...arr
        ]);
      },

      saveResourceReport = ( id, resources ) => {
        saveReport( id, "resources.txt", performanceResourcesToTable( resources ) );
      },

      /**
       * @param {string} id
       * @param {string} filename
       * @param {string} contents
       */
      saveReport = ( id, filename, contents ) => {
        const FILENAME_RE = /[^a-zA-Z\d\-\_]/g,
              normalizedTitle = filename.replace( FILENAME_RE, "-" ),
              normalizedSuiteTitle = SUITE_NAME.replace( FILENAME_RE, "-" ),
              path = join( PATH_REPORTS, normalizedSuiteTitle, `${ id }.${ normalizedTitle }` );
        shell.mkdir( "-p" , dirname( path ) );
        return fs.writeFileSync( path, contents, "utf8" );
      },

      /**
       * Create all of comparing dirs when non existing
       */
      initCompareDirs = () => {
        [ "expected", "actual", "diff" ].forEach(( stage ) => {
          shell.mkdir( "-p" , join( PATH_COMPARE, stage ) );
        });
      },
      /**
       * @param {string} stage
       * @param {string} testId
       * @returns {string}
       */
      getComparePath = ( stage, testId ) => join( PATH_COMPARE, stage, `${ testId }.png` ),


      /**
       * @param {number} max
       * @returns {number}
       */
      randomInt = ( max ) => Math.floor( Math.random() * Math.floor( max ) ),

      /**
       * Report step to Allure
       * @see https://github.com/zaqqaz/jest-allure
       * @param {String} name
       */
      startStep = ( name ) => {
        typeof global.reporter !== "undefined" && global.reporter.startStep( name );
      },

      /**
       * Report step to Allure
       * @see https://github.com/zaqqaz/jest-allure
       */
      endStep = () => {
        typeof global.reporter !== "undefined" && global.reporter.endStep();
      },

      once = async ( cb ) => {
        onceCounter === 0 && await cb();
        onceCounter++;
      },

      /**
      * Save Puppeteer run-time data for Puppetry
      * @param {String} json
      */
      savePuppetterInfo = async ( bs ) => {
        const filePath = join( PATH_LOGS, "puppeteer.info.json" );

        try {
          const data = bs.browser
          ? {
              browser: {
                version: await bs.browser.version(),
                userAgent: await bs.browser.userAgent()
              }
            }
          : { error: bs.error };
          shell.mkdir( "-p" , dirname( filePath ) );
          fs.writeFileSync( filePath, JSON.stringify( data, null, 2 ), "utf8" );
        } catch ( e ) {
          console.warn( `Could not create ${ filePath }`, e );
        }
      };

/**
 *
 * @param {String} str
 * @param {Number} limit
 * @returns {String}
 */
function truncate( str, limit ) {
  str = ( "" + str ).trim();
  return ( str.length > limit ) ? str.substr( 0, limit - 3 ) + "..." : str;
}

/**
 *
 * @param {Number} size
 * @returns {Number}
 */
function bytesToString( size ) {
  const neg = size < 0;
  if ( !size ) {
    return size;
  }
  if ( neg ) {
      size = -size;
  }
  const i = Math.floor( Math.log( size ) / Math.log( 1024 ) );
  return ( neg ? "-" : "" ) + ( size / Math.pow( 1024, i ) )
    .toFixed( 2 ) * 1 + [ "B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ][ i ];
};

/**
 *
 * @param {string} path
 * @param {string} locale
 * @returns {string}
 */
function fake( path, locale ) {
  const [ ns, method ] = path.split( "." );
  faker.locale = locale;
  return faker[ ns ][ method ]();
}

/**
 * @typedef {object} PollParams
 * @property {string} url
 * @property {number} interval in ms
 * @property {number} timeout in ms
 * @property {function} parserFn
 * @param {object} [parserPayload] - extra payload for callback (e.g. email, timestamp)
 * @param {function} [requestFn] - optional function to replace the default one
 */
/**
 * poll given URL for value
 * @param {PollParams} params
 * @returns {Promise}
 */
function pollForValue({ url, interval, timeout, parserFn, parserPayload = {}, requestFn = null }) {

  const request = requestFn ? requestFn : async ( url ) => {
    const rsp = await fetch( url );
    if ( rsp.status < 200 || rsp.status >= 300  ) {
      return {};
    }
    return await rsp.json();
  };

  return new Promise(( resolve, reject ) => {
    const startTime = Date.now();
    pollForValue.attempts = 0;

    async function attempt() {
      if ( Date.now() - startTime > timeout ) {
        return reject( new Error( `Polling: Exceeded timeout of ${ timeout }ms` ) );
      }
      const value = parserFn( await request( url ), parserPayload );
      pollForValue.attempts ++;
      if ( !value ) {
        return setTimeout( attempt, interval );
      }
      resolve( value );
    }
    attempt();

  });
}



exports.fetch = fetch;

exports.localStorage = localStorage;

exports.util = {

  png,

  once,

  tracePng,

  startStep,

  endStep,

  getComparePath,

  initCompareDirs,

  bytesToString,

  saveResourceReport,

  savePuppetterInfo,

  setProjectDirectory: ( projectDirectory ) => {
    PATH_SCREENSHOTS = join( projectDirectory, "/screenshots");
    PATH_COMPARE = join( projectDirectory, "/snapshots");
    PATH_REPORTS = join( projectDirectory, "/reports");
    PATH_LOGS = join( projectDirectory, "/logs");
  },

  setSuiteName: ( name ) => {
    SUITE_NAME = name;
  },

  generateTmpUploadFile,

  pollForValue,

  PATH_SCREENSHOTS,
  PATH_REPORTS,
  PATH_LOGS,
  PATH_COMPARE,
  SUITE_NAME,

  exp: {
    fake,
    /**
     * @param {string[]} json
     * @returns {string}
     */
    random: ( json ) => json[ randomInt( json.length  ) ],
    /**
     * @param {string[]} json
     * @param {string} id
     * @returns {string}
     */
    iterate: ( json, id ) => {
      const sid = `iterate_${ id }`,
            inx = parseInt( localStorage.getItem( sid ) || 0, 10 );
      localStorage.setItem( sid, ( inx + 1 ) >= json.length ? 0 : inx + 1 );
      return `${ json[ inx ] }`;
    },
    /**
     * @param {string} id
     * @returns {string}
     */
    counter: ( id ) => {
       const sid = `counter_${ id }`,
            val = parseInt( localStorage.getItem( sid ) || 0, 10 ) + 1;
      localStorage.setItem( sid, val );
      return `${ val }`;
    }
  }

};

