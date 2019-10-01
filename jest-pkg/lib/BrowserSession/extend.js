
/**
 * Extending Puppeteer
 *
 * @param {BrowserSession} bs
 * @returns {Function}
 */
module.exports = function( bs, util ) {

  const RES_TYPES = [ "Stylesheet", "Image", "Media", "Font", "Script", "XHR", "Fetch" ];
  /**
   * Evaluate the XPath expression and return the first ElementHandle
   *
   * @param {String} selector
   * @return {?ElementHandle}
   */
  async function queryXpath( selector ) {
    const [ elh ] = await bs.page.$x( selector );
    return elh;
  }

  /**
   * Query for ElementHandle by CSS selector
   *
   * @param {String} selector
   * @param {String} target
   * @return {?ElementHandle}
   */
  bs.findHandleByCss = async function ( selector, target ) {
    const elh = await bs.page.$( selector );
    if ( !elh ) {
      throw new Error( "Cannot find target " + target + " (CSS: " + selector + ")" );
    }
    return elh;
  };

  /**
   * Query for ElementHandle by XPath
   *
   * @param {String} selector
   * @param {String} target
   * @return {?ElementHandle}
   */
  bs.findHandleByXpath = async function ( selector, target ) {
    const elh = await queryXpath( selector );
    if ( !elh ) {
      throw new Error( "Cannot find target " + target + " (XPath: " + selector + ")" );
    }
    return elh;
  };

  /**
   *
   * @param {String} selector
   * @param {String} target
   * @return {?ElementHandle}
   */
  bs.findHandleBySelectorChain = async function ( selector, target ) {
    const elh = await bs.page.evaluateHandle( selector );
    if ( !elh ) {
      throw new Error( "Cannot find target " + target + " (" + selector + ")" );
    }
    return elh;
  };

  /**
   * Create element that highlights a given target
   * @param {Function} elementHandleCb
   * @param {String} targetName
   * @param {String} fgColor
   * @returns {void}
   */
  createTargetHighlight = async ( elementHandleCb, targetName, fgColor = "red" ) => {
      const elementHandle = await elementHandleCb(),
            boundingBox = await elementHandle.boundingBox();
      if ( !boundingBox ) {
        return;
      }
      await bs.page.evaluate( ( box, targetName, fgColor ) => {
        const styles = [
          `position: absolute`,
          `z-index: 99998`,
          `left: ${ box.x }px`,
          `top: ${ box.y }px`,
          `width: ${ box.width }px`,
          `height: ${ box.height }px`,
          "overflow: hidden",
          `border: 1px dashed ${ fgColor }`,
          `outline: 1px dashed white`,
          `color: ${ fgColor }`,
          "font-size: 14px",
          "text-shadow: -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF"
        ];
        document.body.insertAdjacentHTML( "beforeend", `<div data-puppetry="__puppetry-highlight-target" `
          + `style="${ styles.join( "; " ) };">&nbsp;${ targetName }</div>` );
        return Promise.resolve();
      }, boundingBox, targetName, fgColor );
  };

  bs.tracePage = async ( stepId )  => {
    await bs.page.screenshot( util.tracePng( `${ stepId }` ) );
  };

  bs.traceTarget = async ( stepId, targetMap  )  => {
    try {
      for ( let pair of Object.entries( targetMap ) ) {
        await createTargetHighlight( pair[ 1 ], pair[ 0 ] );
      }
      await bs.page.screenshot( util.tracePng( `${ stepId }` ) );
      await bs.page.evaluate( () => {
        Array.from( document.querySelectorAll( "[data-puppetry=__puppetry-highlight-target]" ) )
          .forEach( el => el.parentNode.removeChild( el ) );
        return Promise.resolve();
      });
    } catch ( e ) {
      // ignore
    }
  };

  // assert preformance budget
  bs.performance = {
    responses: {},
    resources: [],

    reset: () => {
      bs.performance.responses = {};
      bs.performance.resources = [];
    },
    /**
     * @see https://chromedevtools.github.io/devtools-protocol/tot/Network
     */
    async watchTraffic() {

      const session = await bs.page.target().createCDPSession();
      await session.send( "Network.enable" );

      // map responses
      session.on( "Network.responseReceived", ({ requestId, response, type }) => {
        type = ( type === "Fetch" ? "XHR" : type );
        if ( !RES_TYPES.includes( type ) ) {
          return;
        }
        bs.performance.responses[ requestId ] = { ...response, type };
      });
      // collect response details
      session.on( "Network.dataReceived", ({ requestId, encodedDataLength }) => {
        if ( !bs.performance.responses.hasOwnProperty( requestId ) ) {
          return;
        }
        const { url, type, mimeType } = bs.performance.responses[ requestId ];
        if ( url.startsWith( "data:" ) ) {
          return;
        }
        bs.performance.resources.push({
          url, // Response URL. This URL can be different from CachedResource.url in case of redirect.
          type,
          length: encodedDataLength // Actual bytes received (might be less than dataLength for compressed encodings).
        });
      });

    }
  };

};