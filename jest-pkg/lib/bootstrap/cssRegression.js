
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

    bs.assertScreenshot = async ( filename, screenshotOpts, pixelmatchOpts ) => {

      const expectedPath = util.getComparePath( "expected", filename ),
            actualPath = util.getComparePath( "actual", filename ),
            diffPath = util.getComparePath( "diff", filename );

      util.initCompareDirs();

      if ( !fs.existsSync( expectedPath ) ) {
        await bs.page.screenshot({ path: expectedPath, ...screenshotOpts });
        return 0;
      }

      await bs.page.screenshot({ path: actualPath, ...screenshotOpts });

      const expectedImg = PNG.sync.read( fs.readFileSync( expectedPath ) );
            actualImg = PNG.sync.read( fs.readFileSync( actualPath ) ),
            { width, height } = expectedImg,
            diffImg = new PNG({ width, height }),

            res = pixelmatch( expectedImg.data, actualImg.data, diffImg.data, width, height, {
              threshold: pixelmatchOpts.threshold,
              diffColor: pixelmatchOpts.diffColor,
              aaColor: pixelmatchOpts.aaColor,
              includeAA: pixelmatchOpts.includeAA
            });

      // alternative
      // diffImg.pack().pipe( fs.createWriteStream( diffPath ) );
      fs.writeFileSync( diffPath, PNG.sync.write( diffImg ) );
      return res;
    };

};