
const compareImages = require( "resemblejs/compareImages" ),
      { join } = require( "path" ),
      fs = require( "fs" );
/**
 *
 * @param {BrowserSession} bs
 * @returns {Function}
 */
module.exports = function( bs, util ) {

    bs.assertScreenshot = async ( testId, opts ) => {

    const options = {
              output: {
                 errorColor: {
                    red: 255,
                    green: 0,
                    blue: 255
                  },
                  errorType: "movement",
                  transparency: 0.3,
                  largeImageThreshold: 1200,
                  useCrossOrigin: false,
                  outputDiff: true,
                  ...opts.compare.output
              },
              scaleToSameSize: true,
              ignore: "antialiasing"
            },
            expected = util.getComparePath( "expected", testId ),
            actual = util.getComparePath( "actual", testId ),
            diff = util.getComparePath( "diff", testId );

      util.initCompareDirs();

      if ( !fs.existsSync( expected ) ) {
        await bs.page.screenshot({ path: expected });
        return 0;
      }

      await bs.page.screenshot({ path: actual });

      const data = await compareImages(
        fs.readFileSync( expected ),
        fs.readFileSync( actual ),
        options
      );

      await fs.writeFile( diff, data.getBuffer() );

      return Number( data.misMatchPercentage );

    };

};