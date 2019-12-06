const { assertionMap, filterGaBeacons, validateGaBeacons, valsToString } = require( "../GaTracking/helpers" );

module.exports = function( expect, util ) {
  /**
   * Extending JEST
   */
  const OPERATOR_MAP = {
    gt: "> ",
    lt: "< ",
    eq: ""
  };

  /**
   *
   * @param {Number} a
   * @param {String} operator
   * @param {Number} b
   * @returns {Boolean}
   */
  function compare( a, operator, b ) {
    // When parameter omited
    if ( isNaN( b ) ) {
      return true;
    }
    switch( operator ) {
      case "eq":
        return a === b;
      case "gt":
        return a > b;
      default:
        return a < b;
    }
  }

  function normalizeMessage( msg ) {
    if ( typeof msg !== "string" ) {
      return msg;
    }
    return msg.replace( /[\n]/gm, " " );
  }
  /**
   * Helper
   * @param {Boolean} pass
   * @param {String} errorMsg
   * @param {String} [vsMsg]
   * @returns {Object}
   */
  function expectReturn( pass, errorMsg, vsMsg = null ) {
    const negativeErrorMsg = vsMsg || errorMsg.replace( " expected ", " not expected " );
    return {
      message: () => normalizeMessage( pass ? negativeErrorMsg : errorMsg ),
      pass
    };
  }

  function isEnabled( assert, key ) {
    if ( !assert.hasOwnProperty( "_enabled" ) ) {
      return true;
    }
    return assert.enabled[ key ];
  }

  function shorten( str ) {
    return str.length > 100 ? str.substr( 0, 100 ) + "..." : str;
  }

  function testResponse( field, assert, getValue ) {
    let operator = assert[ `${ field }Operator` ],
        expected = assert[ `${ field }Value` ],
        actual;

    if ( operator === "any" )     {
      return true;
    }
    actual = getValue();
    if ( field === "status" )  {
      actual = parseInt( actual, 10 );
      expected = parseInt( expected, 10 );
    }
    switch ( operator ) {
      case "equals":
        return { exp: actual === expected, actual: `"${ shorten( actual ) }"`, expected: `to be "${ expected }"` };
      case "contains":
        return { exp: actual.includes( expected ),
          actual: `"${ shorten( actual ) }"`, expected: `to contain "${ expected }"` };
      case "empty":
        return { exp: !Boolean( actual.trim() ), actual: "is not", expected: "to be empty" };
      case "!equals":
        return { exp: actual !== expected,
          actual: `"${ shorten( actual ) }"`, expected: `NOT to be "${ expected }"` };
      case "!contains":
        return { exp: !actual.includes( expected ),
          actual: `"${ shorten( actual ) }"`, expected: `NOT to contain "${ expected }"` };
      case "!empty":
        return { exp: Boolean( actual.trim() ), actual: "is", expected: "to be NOT empty" };
      default:
        return true;
    }
  }

  expect.extend({
    /**
     * Assert value is truthy
     * @param {Boolean} received
     * @param {String} source
     * @returns {Object}
     */
    toBeOk( received, source ) {
      const pass = Boolean( received );
      return expectReturn( pass,
        `[${ source }] expected to be truthy`,
        `[${ source }] expected to be falsy` );
    },

     /**
     * Assert value is truthy
     * @param {Boolean} received
     * @param {String} prop - property/attribute
     * @param {String} source
     * @returns {Object}
     */
    toHaveAttribute( received, prop, source ) {
      const pass = Boolean( received );
      return expectReturn( pass,
        `[${ source }] expected ${ JSON.stringify( prop ) } to be present`,
        `[${ source }] expected ${ JSON.stringify( prop ) } to be absent` );
    },

    /**
     * Assert value is truthy
     * @param {Boolean} received
     * @param {String} prop - property/attribute
     * @param {String} source
     * @returns {Object}
     */
    toHaveClass( received, prop, source ) {
      const pass = Boolean( received );
      return expectReturn( pass,
        `[${ source }] expected to contain class ${ JSON.stringify( prop ) }`,
        `[${ source }] expected not to contain class ${ JSON.stringify( prop ) }` );
    },

    /**
     * Assert value is truthy
     * @param {Boolean} received
     * @param {String} prop - property/attribute
     * @param {String} source
     * @returns {Object}
     */
    toMatchSelector( received, prop, source ) {
      const pass = Boolean( received );
      return expectReturn( pass,
        `[${ source }] expected to match selector ${ JSON.stringify( prop ) }`,
        `[${ source }] expected not to match selector ${ JSON.stringify( prop ) }` );
    },

     /**
     * Assert value is truthy
     * @param {Boolean} received
     * @param {String} prop - property/attribute
     * @param {String} source
     * @returns {Object}
     */
    toHavePropertyTrue( received, prop, source ) {
      const pass = Boolean( received );
      return expectReturn( pass,
        `[${ source }] expected ${ JSON.stringify( prop ) } to be true`,
        `[${ source }] expected ${ JSON.stringify( prop ) } to be false` );
    },

    /**
     * Assert values equal
     * @param {String|Number|Boolean} received
     * @param {String|Number|Boolean} value
     * @param {String} source
     * @returns {Object}
     */
    toBeEqual( received, value, source ) {
      const pass = received === value;
      return expectReturn( pass,
        `[${ source }] expected ${ JSON.stringify( received ) } to equal ${ JSON.stringify( value ) }`,
        `[${ source }] expected ${ JSON.stringify( received ) } not to equal ${ JSON.stringify( value ) }` );
    },

     /**
     * Assert value is an empty string
     * @param {String} received
     * @param {String} source
     * @returns {Object}
     */
    toBeEmpty( received, source ) {
      if ( typeof received !== "string" ) {
        return expectReturn( false,
          `[${ source }] expected ${ JSON.stringify( received ) } to be a string, but it is ${ typeof received }` );
      }
      const pass = !received.trim().length;
      return expectReturn( pass,
        `[${ source }] expected ${ JSON.stringify( received ) } to be empty`,
        `[${ source }] expected ${ JSON.stringify( received ) } to be not empty` );
    },

     /**
     * Assert value is truthy
     * @param {Boolean} received
     * @param {*} mismatchTolerance
     * @param {String} source
     * @returns {Object}
     */
    toMatchScreenshot( received, mismatchTolerance, source ) {
      const pass = Number( received ) === 0;
      return expectReturn( pass,
        `[${ source }] expected to satisfy mismatch tolerance of ${ mismatchTolerance }`,
        `[${ source }] expected `
          + `not to satisfy mismatch tolerance of ${ mismatchTolerance }` );
    },

    /**
     * Assert that string includes substring
     * @param {String} received
     * @param {String} substring
     * @param {String} source
     * @returns {Object}
     */
    toIncludeSubstring( received, substring, source ) {
      const pass = received.includes( substring );
      return expectReturn( pass,
        `[${ source }] expected "${received}" to contain "${substring}"`,
        `[${ source }] expected "${received}" not to contain "${substring}"` );
    },

   /**
     * Assert that at least one element of passed array includes substring
     * @param {String[]} received
     * @param {String} substring
     * @param {String} expectation
     * @param {String} source
     * @returns {Object}
     */
    toHaveString( received, substring, expectation, source ) {
      const pass = received.some( string => string === substring ),
            receivedPrint = `[${ received.join(",").substr( 0, 128 ) }..]`;

      if ( expectation ) {
        return expectReturn( pass,
        `[${ source }] expected ${ expectation }`,
        `[${ source }] expected not ${ expectation }` );
      }
      return expectReturn( pass,
        `[${ source }] expected at least one of "${ receivedPrint }" to be "${substring}"`,
        `[${ source }] expected none of "${ receivedPrint }" to be "${substring}"` );
    },

     /**
     * Assert that at least one element of passed array includes substring
     * @param {String[]} received
     * @param {String} substring
     * @param {String} expectation
     * @param {String} source
     * @returns {Object}
     */
    toHaveSubstring( received, substring, expectation, source ) {
      const pass = received.some( string => string.includes( substring ) ),
            receivedPrint = `[${ received.join(",").substr( 0, 128 ) }..]`;
      if ( expectation ) {
        return expectReturn( pass,
        `[${ source }] expected ${ expectation }`,
        `[${ source }] expected not ${ expectation }` );
      }
      return expectReturn( pass,
        `[${ source }] expected at least one of "${ receivedPrint }" to contain "${substring}"`,
        `[${ source }] expected none of "${ receivedPrint }" to contain "${substring}"` );
    },

    /**
     * Asser condition
     * @param {Number} rawReceived
     * @param {String} operator
     * @param {Number} rawValue
     * @param {String} expectation
     * @param {String} source
     * @returns {Object}
     */
    toPassCondition( rawReceived, operator, rawValue, expectation, source ) {
      const received = parseInt( rawReceived, 10 ),
            value = parseInt( rawValue, 10 ),
            pass = operator === "eq"
              ? received === value
              : ( operator === "gt" ? received > value : received < value );

      return expectReturn( pass,
        `[${ source }] expected ${ expectation
          ? `${ expectation } (${ received })` : received } to be ${ OPERATOR_MAP[ operator ] }${ value }` );
    },

    /**
     * Assert the received bounding box satisfies the snapshot
     * @param {Object} received
     * @param {Object} snapshot
     * @param {String} source
     * @returns {Object}
     */
    toMatchBoundingBoxSnapshot( received, snapshot, source ) {
      const x = compare( received.x, snapshot.xOperator, parseInt( snapshot.xValue, 10 ) ),
            y = compare( received.y, snapshot.yOperator, parseInt( snapshot.yValue, 10 ) ),
            w = compare( received.width, snapshot.wOperator, parseInt( snapshot.wValue, 10 ) ),
            h = compare( received.height, snapshot.hOperator, parseInt( snapshot.hValue, 10 ) );


      if ( isEnabled( snapshot, "xValue" ) && !x ) {
        return expectReturn( x,
          `[${ source }] expected for box.x (${received.x}px) to be `
          + `${OPERATOR_MAP[snapshot.xOperator]}${snapshot.xValue}px` );
      }
      if ( isEnabled( snapshot, "yValue" ) && !y ) {
        return expectReturn( y,
          `[${ source }] expected for box.y (${received.y}px) to be `
          + `${OPERATOR_MAP[snapshot.yOperator]}${snapshot.yValue}px` );
      }
      if ( isEnabled( snapshot, "wValue" ) &&!w ) {
        return expectReturn( w,
          `[${ source }] expected for box.width (`
            + `${received.width}px) to be ${OPERATOR_MAP[snapshot.wOperator]}${snapshot.wValue}px` );
      }
      if ( isEnabled( snapshot, "hValue" ) && !h ) {
        return expectReturn( h,
          `[${ source }] expected for box.height (${received.height}px)`
            + ` to be ${OPERATOR_MAP[snapshot.hOperator]}${snapshot.hValue}px` );
      }
      return expectReturn( true, `` );
    },

    /**
     *
     * @param {Object} resources [{ url, type, length},..]
     * @param {String} type
     * @param {Number} val
     * @param {String} source
     * @returns {Object}
     */
    toMatchAssetWeight( resources, type, val, source ) {
        const assets = resources.filter( res => res.type.toLowerCase() === type.toLowerCase() ),
              totalWeight =  assets.reduce(( carry, res ) => {
                carry += res.length;
                return carry;
              }, 0 );

        return expectReturn( totalWeight < val, `[${ source }] expected `
          + `total weight of ${ type } assets to be under`
          + ` ${ util.bytesToString( val ) }, but found ${ assets.length } assets `
          + `with total weight ${ util.bytesToString( totalWeight ) }` );
    },

    /**
     *
     * @param {Object} resources [{ url, type, length},..]
     * @param {String} type
     * @param {Number} val
     * @param {String} source
     * @returns {Object}
     */
    toMatchAssetCount( resources, type, val, source ) {
        const assets = resources.filter( res => res.type.toLowerCase() === type.toLowerCase() );
        return expectReturn( assets.length < val, `[${ source }] expected `
          + `total number of ${ type } assets to be under`
          + ` ${ val }, but found ${ assets.length  }` );
    },

    /**
     *
     * @param {Response[]} responses
     * @param {Object} assert
     * @param {String} source
     * @returns {Object}
     */
    toMatchResponse( responses, assert, source ) {
      const matches = responses.filter( rsp => {
        return rsp.url().includes( assert.url )
          && ( assert.method === "any" || rsp.request().method().toUpperCase() === assert.method )
          && ( assert.status && parseInt( rsp.status(), 10 ) === parseInt( assert.status, 10 ) );
      });

      if ( assert.not === "true" ) {
        return expectReturn( Boolean( !matches.length ), `[${ source }] expected NO HTTP/S `
          + `responses matching ${ assert.method } *${ assert.url }*`
          + ` with status code ${ assert.status }, but found ${ matches.length }` );
      }
      return expectReturn( Boolean( matches.length ), `[${ source }] expected any HTTP/S `
        + `responses matching ${ assert.method } *${ assert.url }*`
        + ` with status code ${ assert.status }, but found none` );

    },

      /**
     *
     * @param {Response} rsp
     * @param {String} url
     * @param {Object} assert
     * @param {String} source
     * @returns {Object}
     */
    toMatchRequest( rsp, url, assert, source ) {
      const errIntro = `[${ source }] expected HTTP/S response matching ${ url }`,
            RE = /\"/g;
      if ( !rsp ) {
        // early exist, makes no sense to proceed
        return expectReturn( false, `${ errIntro }, but nothing intercepted` );
      }
      let res;

      res = testResponse( "status", assert, () => rsp.status() );
      if ( res !== true && !res.exp ) {
        return expectReturn( res.exp,
          `${ errIntro } with status code ${ res.expected.replace( RE, "" ) },`
          + ` but received code ${ res.actual.replace( RE, "" ) }` );
      }

      res = testResponse( "text", assert, () => rsp.data );
      if ( res !== true && !res.exp ) {
        return expectReturn( res.exp,
          `${ errIntro } with data ${ res.expected }, but received data `
            + `${ res.actual }` );
      }

      if ( assert.headerOperator === "any" ) {
        return expectReturn( true, `${ errIntro }, but nothing intercepted` );
      }
      const pass = Object.entries( rsp.headers() )
        .find( pair => ( pair[ 0 ].toLowerCase() === assert.headerName.toLowerCase()
          && pair[ 1 ] === assert.headerValue ) );
      return expectReturn( Boolean( pass ),
        `${ errIntro } to have header ${ assert.headerName }: ${ assert.headerValue }, but it does not` );

    },

    /**
     *
     * @param {Object} actual
     * @param {Object} expected
     * @param {String} source
     * @returns {Object}
     */
    toBeVisible( actual, expected, source ) {
        const renderDetails = ( actual ) => actual.isAvailable ? `[display: ${ actual.display }, `
              + `visibility: ${ actual.visibility }, opacity: ${ actual.opacity }, `
              + `offset: ${ actual.isIntersecting ? "within viewport" : "out of viewport" }]`
              : `[ not available ]`;

        switch ( true ) {

          case actual.isAvailable === false && expected.availability === "available":
            // early exist, makes no sense to proceed
            return expectReturn( false, `[${ source }] expected the target element to be `
              + `available, but it is not` );

          case actual.isAvailable === true && expected.availability === "unavailable":
            // early exist, makes no sense to proceed
            return expectReturn( false, `[${ source }] expected the target element to be `
              + `not available, but it is` );

          case expected.availability === "visible"
            && (
              actual.isAvailable === false
              || actual.display === "none"
              || actual.visibility === "hidden"
              || actual.opacity === 0
              || !actual.isIntersecting
            ):
            return expectReturn( false, `[${ source }] expected the target element to be `
              + `available and observable, but it is not ${ renderDetails( actual ) }`);

          case expected.availability === "invisible" && actual.isAvailable === true:
            if ( actual.display === "none"
              || actual.visibility === "hidden"
              || actual.opacity === 0
              || !actual.isIntersecting ) {
              return expectReturn( true, `[${ source }] expected the target element to be `
              + `available and not observable, but it is` );
            }
            return expectReturn( false, `[${ source }] expected the target element to be `
              + `available and not observable, but it is ${ renderDetails( actual ) }` );

          case actual.display === "none" && expected.display === "not":
            return expectReturn( false, `[${ source }] expected the target element to have `
              + `display NOT none, but it is none` );

          case actual.display !== "none" && expected.display === "none":
            return expectReturn( false, `[${ source }] expected the target element to have `
              + `display none, but it is ${ actual.display }` );

          case  actual.visibility === "hidden" && expected.visibility === "not":
            return expectReturn( false, `[${ source }] expected the target element to have `
              + `visibility NOT hidden, but it is hidden` );

          case actual.visibility !== "hidden" && expected.visibility === "hidden":
            return expectReturn( false, `[${ source }] expected the target element to have `
              + `visibility hidden, but it is ${ actual.visibility }` );

          case actual.opacity === 0 && expected.opacity === "not":
            return expectReturn( false, `[${ source }] expected the target element to have `
              + `opacity > 0, but it is 0` );

          case actual.opacity !== 0 && expected.opacity === "0":
            return expectReturn( false, `[${ source }] expected the target element to have `
              + `opacity 0, but it is ${ actual.opacity }` );

          case actual.isIntersecting !== true && expected.isIntersecting === "true":
            return expectReturn( false, `[${ source }] expected the target element to be `
              + `within the viewport, but it is not` );

          case actual.isIntersecting === true && expected.isIntersecting === "false":
            return expectReturn( false, `[${ source }] expected the target element to be `
              + `out of the viewport, but it is not` );
        }

        // everything fine
        return expectReturn( true, `[${ source }] expected the target element to be `
            + `available, but it is not` );

    },


    /**
     *
     * @param {PerformanceResourceTiming} metrics
     * @param {String} type
     * @param {Number} val
     * @param {String} source
     * @returns {Object}
     */
    toMatchTiming( metrics, type, val, source ) {
      let actual;
      switch ( type ) {
        case "network":
          actual = metrics.responseEnd - metrics.fetchStart;
          break;
        case "redirection":
          actual = metrics.redirectEnd - metrics.redirectStart;
          break;
        case "processing":
          actual = metrics.loadEventEnd - metrics.responseEnd;
          break;
        default:
          actual = metrics.loadEventEnd - metrics.navigationStart;
          break;
      }
      return expectReturn( actual < val, `[${ source }] expected `
        + `the ${ type } time to be under`
        + ` ${ val }μs, but found ${ actual }μs` );
    },


    /**
     *
     * @param {UaBeacon[]} beacons [{ type, data, ec },..]
     * @param {Object} assert
     * @param {String} source
     * @returns {Object}
     */
    toMatchGaTracking( beacons, assert, source ) {
        if ( typeof process.env.DEBUG_GA_BEACON !== "undefined" ) {
          console.info( "toMatchGaTracking#1", { action: assert.action, beacons } );
        }
        try {
          const GA = "Google Analytics";
          let matches, found, precise;
          switch( assert.action ) {
            case "pageview":
              found = beacons.filter( res => res.type === assert.action );
              return expectReturn( !!found.length,
                `[${ source }] expected to send "pageview" data to ${ GA }, but it is not sent` );
            case "event":
            case "social":
            case "screenview":
            case "timing":
            case "exception":
              found = beacons.filter( res => res.type === assert.action );

              matches = filterGaBeacons( found, assert );
              validateGaBeacons( matches, assert );

              return expectReturn( !!matches.length, `[${ source }] expected to send "${ assert.action }" data `
                + `(${ valsToString( assert ) }) to ${ GA }, but it is not sent` );

            case "ecProductImpression":
              found = beacons.filter( beacon => beacon.ec.impressions.length );
              // we need now an even per impression
              precise = found.reduce( ( carry, b ) => {
                b.ec.impressions.forEach( i => {
                  const data = b;
                  data.ec.impressions= [ i ];
                  carry.push( data );
                });
                return carry;
              }, []);
              matches = filterGaBeacons( precise, assert );
              validateGaBeacons( matches, assert );
              return expectReturn( !!matches.length, `[${ source }] expected to send "EC: Product Impression" data `
                + `(${ valsToString( assert ) }) to ${ GA }, but it is not sent` );

            case "ecProductClick":
              found = beacons.filter( beacon => beacon.ec.action.name === "click" );
              validateGaBeacons( found, assert );
              return expectReturn( !!found.length,
                `[${ source }] expected to send "EC: Product Click" data to ${ GA }, but it is not sent` );

            case "ecProductDetails":
              found = beacons.filter( beacon => beacon.ec.action.name === "detail" );
              validateGaBeacons( found, assert );
              return expectReturn( !!found.length,
                `[${ source }] expected to send "EC: Product Details View" data to ${ GA }, but it is not sent` );

             case "ecAddToCart":
              found = beacons.filter( beacon => beacon.ec.action.name === "add" );
              validateGaBeacons( found, assert );
              return expectReturn( !!found.length,
                `[${ source }] expected to send "EC: Add Products to cart" data to ${ GA }, but it is not sent` );

            case "ecRemoveFromCart":
              found = beacons.filter( beacon => beacon.ec.action.name === "remove" );
              validateGaBeacons( found, assert );
              return expectReturn( !!found.length,
                `[${ source }] expected to send "EC: Remove Products from cart" data to ${ GA }, but it is not sent` );

            case "ecCheckout":
              found = beacons.filter( beacon => ( beacon.ec.action.name === "checkout"
                || beacon.ec.action.name === "checkout_option" ) );
              matches = filterGaBeacons( found, assert );
              validateGaBeacons( found, assert );
              return expectReturn( !!matches.length,
                `[${ source }] expected to send "EC: Checkout" data `
                + `(${ valsToString( assert ) }) to ${ GA }, but it is not sent` );

            case "ecRefund":
              found = beacons.filter( beacon => beacon.ec.action.name === "refund" );
              matches = filterGaBeacons( found, assert );
              validateGaBeacons( matches, assert );
              return expectReturn( !!matches.length,
                `[${ source }] expected to send "EC: Refund" data `
                + `(${ valsToString( assert ) }) to ${ GA }, but it is not sent` );

            case "ecPurchase":
              found = beacons.filter( beacon => beacon.ec.action.name === "purchase" );
              matches = filterGaBeacons( found, assert );
              validateGaBeacons( matches, assert );
              return expectReturn( !!matches.length,
                `[${ source }] expected to send "EC: Purchase" data `
                + `(${ valsToString( assert ) }) to ${ GA }, but it is not sent` );

            case "ecPromotion":
              found = beacons.filter( beacon => beacon.data.action === "add promo" || beacon.ec.promotions.length );
              matches = filterGaBeacons( found, assert );
              validateGaBeacons( matches, assert );
              return expectReturn( !!matches.length,
                `[${ source }] expected to send "EC: Promotion" data `
                + `(${ valsToString( assert ) }) to ${ GA }, but it is not sent` );

            case "ecommerceAddTransaction":
              found = beacons.filter( beacon => beacon.type === "transaction" );
              matches = filterGaBeacons( found, assert );
              validateGaBeacons( found, assert );
              return expectReturn( !!matches.length,
                `[${ source }] expected to send "EC: Adding a Transaction" data `
                + `(${ valsToString( assert ) }) to ${ GA }, but it is not sent` );

             case "ecommerceAddItem":
              found = beacons.filter( beacon => beacon.type === "item" );
              matches = filterGaBeacons( found, assert );
              validateGaBeacons( found, assert );
              return expectReturn( !!matches.length,
                `[${ source }] expected to send "EC: Adding an Item" data `
                + `(${ valsToString( assert ) }) to ${ GA }, but it is not sent` );

          }
      } catch ( err ) {
        // console.error( err );
        return expectReturn( false, `[${ source }] expected no exceptions, but one thrown: ${ err.message }` );
      }
    },

    /**
     * Assert position
     *
     * @param {Object} received
     * @param {String} position
     * @param {Object} target
     * @param {Object} counterpart
     * @param {String} source
     * @returns {Object}
     */
    toMatchPosition( received, position, target, counterpart, source ) {
      const a = received.target,
            b = received.counterpart;
      let pass;
      switch ( position ) {
        case "above":
          pass = a.y + a.height <= b.y;
          if ( !pass ) {
            return expectReturn( pass, `[${ source }] expected ${ target } (y=${ a.y }, height=${ a.height }) `
              + `to be above ${ counterpart } (y=${ b.y })` );
          }
          break;
        case "below":
          pass = a.y >= b.y + b.height;
          if ( !pass ) {
            return expectReturn( pass, `[${ source }] expected ${ target } (y=${ a.y }) to be below ${ counterpart } `
              + `(y=${ b.y }, height=${ b.height }) ` );
          }
          break;
        case "left":
          pass = a.x + a.width <= b.x;
          if ( !pass ) {
            return expectReturn( pass, `[${ source }] expected ${ target } `
              + `(x=${ a.x }, width=${ a.width }) `
              + `to be left to ${ counterpart } (x=${ b.x })` );
          }
          break;
        case "right":
          pass = a.x >= b.x + b.width;
          if ( !pass ) {
            return expectReturn( pass, `[${ source }] expected ${ target } (x=${ a.x }) `
              + `to be right to ${ counterpart } `
              + `(x=${ b.x }, width=${ b.width })` );
          }
          break;
      }
      return expectReturn( true, `` );
    }

  });


};