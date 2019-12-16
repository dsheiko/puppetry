const url = require( "url" );

function resolveUrl( uriRaw, baseUrl ) {
  const uri = uriRaw.trim();
  if ( !uri ) {
    return null;
  }
  if ( uri.startsWith( "#" ) ) {
    return null;
  }
  const { protocol } = url.parse( uri );
  if ( !protocol ) {
    return url.resolve( baseUrl, uri ).split( "#" )[ 0 ];
  }
  if ( [ "http:", "https:" ].includes( protocol ) ) {
    return uri.split( "#" )[ 0 ];
  }
  return null;
}

/**
 * Extending Puppeteer wtih crawler
 *
 * @param {BrowserSession} bs
 * @returns {Function}
 */
module.exports = function( bs ) {

  bs.crawl = async ( baseUrl ) => {
    const links = new Set();
    await bs.page.exposeFunction( "PUPPETRY_CLAWLER_ADD_LINK", uri => {
      const link = resolveUrl( uri, baseUrl );
      link && links.add( link );
    });
    await bs.page.evaluate(() => {
      function findCrawlerLinks( document ) {
        document.querySelectorAll( "a[href]" ).forEach( ( link ) => {
          window.PUPPETRY_CLAWLER_ADD_LINK( link.href );
        });
        document.querySelectorAll( "iframe,frame" ).forEach( frame => {
          try {
            findCrawlerLinks( frame.contentDocument );
          } catch ( e ) {
            console.warn( e.message );
            if ( frame.src ) {
              window.PUPPETRY_CLAWLER_ADD_LINK( frame.src );
            }
          }
        });
      }
      findCrawlerLinks( window.document );
    });
    return links;
  };

};