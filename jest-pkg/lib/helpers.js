
const { join } = require( "path" ),
      shell = require( "shelljs" ),
      fetch = require( "node-fetch" ),
      { dirname } = require( "path" );

let PATH_SCREENSHOTS = join( __dirname, "/../", "/screenshots");

    /**
     * @see https://pptr.dev/#?product=Puppeteer&version=v1.5.0&show=api-class-page
     * @param {string} filePath
     * @param {Object} [options]
     * @returns {Object}
     */
const png = ( filePath, options = {} ) => {
        const normalizedPath = filePath.replace( /[^a-zA-Z\d\-\_\\\/]/g, "-" );
        const path = join( PATH_SCREENSHOTS, `${normalizedPath}.png` );
        shell.mkdir( "-p" , dirname( path ) );
        return { path, ...options };
      };

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

exports.setPngBasePath = ( path ) => {
  PATH_SCREENSHOTS = path;
};

exports.makePng = ( ns ) => ( filePath, options = {} ) => {
  return png( `${ns}/${filePath}`, options );
};

exports.png = png;
exports.fetch = fetch;
exports.pollForValue = pollForValue;

