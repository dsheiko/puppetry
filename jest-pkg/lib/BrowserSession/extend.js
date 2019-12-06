const UaBeacon = require( "../GaTracking/UaBeacon" );

/**
 * Extending Puppeteer
 *
 * @param {BrowserSession} bs
 * @returns {Function}
 */
module.exports = function( bs, util ) {

  const RES_TYPES = [ "Stylesheet", "Image", "Media", "Font", "Script", "XHR", "Fetch" ];

  let lastMockSession = null;


  function btoa( a ) {
    return Buffer.from( a ).toString( "base64" );
  }


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
      pelh = await pelh.contentFrame();
    }
    if ( !pelh ) {
      throw new Error( `Cannot find parent of ${ target.target } `
        + `(${ target.css ? "CSS": "XPath" }: ${ target.selector })` );
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
   * Helper to reduce code during Target declaration
   * @param {String} target
   * @param {Function} fn
   * @returns {ElementHandle}
   */
  bs.tryLocalTarget = async ( target, fn ) => {
    try {
        return await fn();
    }
    catch( err ){
      throw new Error( `Cannot find the shadow root of target ${ target }` );
    }
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
   * @param {Function|false} elementHandleCb
   * @param {String} targetName
   * @param {String} fgColor
   * @returns {void}
   */
  async function createTargetHighlight( elementHandleCb, targetName, fgColor = "red" ) {
      const elementHandle = await elementHandleCb();
      if ( !elementHandle ) {
        return;
      }
      const boundingBox = await elementHandle.boundingBox();
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

  bs.traceTarget = async ( stepId, targetMap, cb = null  )  => {
    try {
      for ( let pair of Object.entries( targetMap ) ) {
        await createTargetHighlight( pair[ 1 ], pair[ 0 ] );
      }
      if ( cb ) {
        await cb();
      } else {
        await bs.page.screenshot( util.tracePng( `${ stepId }` ) );
      }
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

  bs.replaceRequest = async ( method, postData )  => {
    await bs.page.setRequestInterception( true );
    bs.page.once("request", interceptedRequest => {
      if ( postData ) {
        return interceptedRequest.continue({
          method,
          postData,
          headers: {
            ...interceptedRequest.headers(),
            "X-Request-Method": method,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
      }
      interceptedRequest.continue();
    });
  },

  bs.getGaTracking = ()  => {
    return bs.performance.resources
      .filter( req => UaBeacon.validateUrl( req.url ) )
      .map( req => new UaBeacon( req.url ) )
      .map( beacon => beacon.toJSON() );
  };

  /**
     * @see https://medium.com/@jsoverson/using-chrome-devtools-protocol-with-puppeteer-737a1300bac0
     */
  bs.mockRequest = async ( url, method, status, contentType, newBody, headers ) => {
    if ( lastMockSession ) {
      lastMockSession.detach();
    }
    const session = await bs.page.target().createCDPSession(),
          patterns = [ `*${ url }*` ];

    await session.send( "Network.enable" );

    await session.send( "Network.setRequestInterception", {
      patterns: patterns.map( pattern => ({
        urlPattern: pattern,
        interceptionStage: "HeadersReceived"
      }))
    });

    lastMockSession = session;

    session.on( "Network.requestIntercepted", async ({ interceptionId, request, responseHeaders, resourceType }) => {

      if ( ( method || "GET" ) !== request.method.toUpperCase() ) {
        await session.send( "Network.continueInterceptedRequest", { interceptionId });
        return;
      }

      const newHeaders = [
        "Date: " + ( new Date() ).toUTCString(),
        "Connection: closed",
        "Content-Length: " + newBody.length,
        "Content-Type: " + contentType,
        ...headers
      ];

      await session.send( "Network.continueInterceptedRequest", {
        interceptionId,
        rawResponse: btoa( `HTTP/1.1 ${ status }\r\n`
          + newHeaders.join('\r\n') + '\r\n\r\n' + newBody )
      });

      session.detach();
    });

  },

  bs.network = {
    responses: [],

    reset: () => {
      bs.network.responses = [];
    },

    async watchTraffic() {
      bs.network.reset();
      bs.page.on( "response", rsp => {
        bs.network.responses.push( rsp );
      });
    }
  },

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

      bs.performance.reset();

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