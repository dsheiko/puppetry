const bs = require( "./BrowserSession" ),
      { util, fetch, localStorage } = require( "./helpers" );

// Include resamble.js
require( "./bootstrap/cssRegression" )( bs, util );
// Extend BS
require( "./BrowserSession/extend" )( bs, util );
// add crawler methods
require( "./BrowserSession/crawler" )( bs );

require( "./bootstrap/extendJest" )( expect, util );

module.exports = ( ns ) => {
  // create namespace-dependent image options creator
  util.setSuiteName( ns );
  return {
    bs,
    util,
    fetch,
    localStorage
  };
};