
const pixelmatch = require( "pixelmatch" ),
      PNG = require( "pngjs" ).PNG,
      { join } = require( "path" ),
      fs = require( "fs" );
/**
 *
 * @param {BrowserSession} bs
 * @returns {Function}
 */
module.exports = function( bs, util ) {

    bs.assertScreenshot = async ( testId, opts ) => {

      const expectedPath = util.getComparePath( "expected", testId ),
            actualPath = util.getComparePath( "actual", testId ),
            diffPath = util.getComparePath( "diff", testId );

      util.initCompareDirs();

      if ( !fs.existsSync( expectedPath ) ) {
        await bs.page.screenshot({ path: expectedPath });
        return 0;
      }

      await bs.page.screenshot({ path: actualPath });

      const expectedImg = PNG.sync.read( fs.readFileSync( expectedPath ) );
            actualImg = PNG.sync.read( fs.readFileSync( actualPath ) ),
            { width, height } = expectedImg,
            diffImg = new PNG({ width, height }),

            res = pixelmatch( expectedImg.data, actualImg.data, diffImg.data, width, height, {
              threshold: opts.threshold,
              diffColor: opts.diffColor,
              aaColor: opts.aaColor,
              includeAA: opts.includeAA
            });


      // alternative
      // diffImg.pack().pipe( fs.createWriteStream( diffPath ) );
      fs.writeFileSync( diffPath, PNG.sync.write( diffImg ) );
      return res;
    };

};