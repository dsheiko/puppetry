
const { join } = require( "path" ),
      shell = require( "shelljs" ),
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

exports.setPngBasePath = ( path ) => {
  PATH_SCREENSHOTS = path;
};

exports.makePng = ( ns ) => ( filePath, options = {} ) => {
  return png( `${ns}/${filePath}`, options );
};

exports.png = png;