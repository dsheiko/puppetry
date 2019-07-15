
const { join } = require( "path" ),
      shell = require( "shelljs" ),
      fetch = require( "node-fetch" ),
      { dirname } = require( "path" ),
      { LocalStorage } = require( "node-localstorage" ),
      faker = require( "faker" ),
      localStorage = new LocalStorage( join( __dirname, "/../", "/storage" ) );

let PATH_SCREENSHOTS = join( __dirname, "/../", "/screenshots"),
    SUITE_NAME = "";

    /**
     * @see https://pptr.dev/#?product=Puppeteer&version=v1.5.0&show=api-class-page
     * @param {string} filePath
     * @param {Object} [options]
     * @returns {Object}
     */
const png = ( filePath, options = {} ) => {
        const normalizedPath = filePath.replace( /[^a-zA-Z\d\-\_]/g, "-" );
        const path = join( PATH_SCREENSHOTS, SUITE_NAME, `${normalizedPath}.png` );
        shell.mkdir( "-p" , dirname( path ) );
        return { path, ...options };
      },
      /**
       * Removes outdated suite screenshots on the beggining of test
       */
      cleanupScreenshotsDir = () => {
        const path = join( PATH_SCREENSHOTS, SUITE_NAME );
        try {
          shell.rm( "-rf" , path );
        } catch ( e ) {
          // ignore
        }
      },
      /**
       * @param {number} max
       * @returns {number}
       */
      randomInt = ( max ) => Math.floor( Math.random() * Math.floor( max ) );

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

  setPngBasePath: ( path ) => {
    PATH_SCREENSHOTS = path;
  },

  setSuiteName: ( name ) => {
    SUITE_NAME = name;
  },

  pollForValue,

  cleanupScreenshotsDir,

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

