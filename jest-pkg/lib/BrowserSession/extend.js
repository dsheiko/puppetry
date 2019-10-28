const UaBeacon = require( "../GaTracking/UaBeacon" );
/**
 * Extending Puppeteer
 *
 * @param {BrowserSession} bs
 * @returns {Function}
 */
module.exports = function( bs, util ) {

  const RES_TYPES = [ "Stylesheet", "Image", "Media", "Font", "Script", "XHR", "Fetch" ];

  /**
   * @typedef {Target}
   * @param {String} target
   * @param {String} selector
   * @param {Boolean} css
   * @param {String} ref
   * @param {String} parentType
   */

  /**
   *
   * @param {Target} target
   * @param {ElementHandle} pelh
   * @returns {?ElementHandle}
   */
  async function query( target, pelh = bs.page ) {
    if ( target.parentType === "iframe" ) {
      pelh = pelh.contentFrame;
    }
    const elh = target.css ? await pelh.$( target.selector ) : await queryXpath( target.selector, pelh );
    if ( !elh ) {
      throw new Error( `Cannot find target ${ target.target } `
        + `(${ target.css ? "CSS": "XPath" }: ${ target.selector })` );
    }
    return elh;
  }

  bs.query = async ( selector, css, target ) => {
    return await query({ target, selector, css });
  };

   /**
   * Evaluate the XPath expression and return the first ElementHandle
   *
   * @param {String} selector
   * @param {ElementHandle} pelh
   * @return {?ElementHandle}
   */
  async function queryXpath( selector, pelh = bs.page ) {
    const [ elh ] = await pelh.$x( selector );
    return elh;
  }

  bs.TARGETS = {};


  function getTargetByName( name ) {
    if ( typeof bs.TARGETS[ name ] === "undefined" ) {
      throw Error( `Target "${ name }" is not defined` );
    }
    return bs.TARGETS[ name ];
  }

  /**
   * When target is not available to doesn't thow an exceptiion, but returns false
   * @param {String} name
   * @returns {ElementHandle|Boolean}
   */
  bs.getTargetOrFalse = async( name )  => {
    const target = getTargetByName( name );
    try {
      return await target();
    } catch ( e ) {
      return false;
    }
  };

  bs.getTarget = async( name )  => {
    const target = getTargetByName( name );
    return await target();
  };

  /**
   *
   * @param {Target[]} targetChain
   * @returns {?ElementHandle}
   */
  bs.queryChain = async ( targetChain ) => {
    const target = targetChain.shift();
    let elh = await query( target );
    for ( let item of targetChain )  {
      elh = await query( item, elh );
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
  async function createTargetHighlight( elementHandleCb, targetName, fgColor = "red" ) {
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
      console.error( e );
      // ignore
    }
  };

  bs.getGaTracking = ()  => {
    return bs.performance.resources
      .filter( req => UaBeacon.validateUrl( req.url ) )
      .map( req => new UaBeacon( req.url ) )
      .map( beacon => beacon.toJSON() );
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

//      session.on( "Network.loadingFinished", ({ requestId, encodedDataLength }) => {
//        console.log("Loading finished", requestId, encodedDataLength);
//      });

      // collect response details
      session.on( "Network.loadingFinished", ({ requestId, encodedDataLength }) => {
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