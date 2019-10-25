const { assertionMap, filterGaBeacons, validateGaBeacons, valsToString } = require( "../GaTracking/helpers" );

module.exports = function( expect, util ) {
  /**
   * Extending JEST
   */
  const OPERATOR_MAP = {
    gt: ">",
    lt: "<",
    eq: "="
  };

  function visibleObjToString( obj ) {
    return `${ obj.isDisplayed ? "" : "NOT " }displayed, ${ obj.isVisible ? "" : "NOT " }visible,`
    + ` ${ obj.isOpaque ? "" : "NOT " } opaque, ${ obj.isIntersecting ? "" : "NOT " }within the viewport`;
  }


  /**
   *
   * @param {Number} a
   * @param {String} operator
   * @param {Number} b
   * @returns {Boolean}
   */
  function compare( a, operator, b ) {
    switch( operator ) {
      case "gt":
        return a > b;
      default:
        return a < b;
    }
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
      message: () => pass ? negativeErrorMsg : errorMsg,
      pass
    };
  }

  function isEnabled( assert, key ) {
    if ( !assert.hasOwnProperty( "_enabled" ) ) {
      return true;
    }
    return assert.enabled[ key ];
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
     * @param {String} received
     * @param {String} substring
     * @param {String} source
     * @returns {Object}
     */
    toHaveString( received, substring, source ) {
      const pass = received.some( string => string === substring ),
            receivedPrint = `[${ received.join(",").substr( 0, 128 ) }..]`;
      return expectReturn( pass,
        `[${ source }] expected "${ receivedPrint }" to have "${substring}"`,
        `[${ source }] expected "${ receivedPrint }" not to have "${substring}"` );
    },

     /**
     * Assert that at least one element of passed array includes substring
     * @param {String} received
     * @param {String} substring
     * @param {String} source
     * @returns {Object}
     */
    toHaveSubstring( received, substring, source ) {
      const pass = received.some( string => string.includes( substring ) ),
            receivedPrint = `[${ received.join(",").substr( 0, 128 ) }..]`;
      return expectReturn( pass,
        `[${ source }] expected "${ receivedPrint }" to contain "${substring}"`,
        `[${ source }] expected "${ receivedPrint }" not to contain "${substring}"` );
    },

    /**
     * Asser condition
     * @param {Number} rawReceived
     * @param {String} operator
     * @param {Number} rawValue
     * @param {String} source
     * @returns {Object}
     */
    toPassCondition( rawReceived, operator, rawValue, source ) {
      const received = parseInt( rawReceived, 10 ),
            value = parseInt( rawValue, 10 ),
            pass = operator === "eq"
              ? received === value
              : ( operator === "gt" ? received > value : received < value );

      return expectReturn( pass,
        `[${ source }] expected ${ received } ${ OPERATOR_MAP[ operator ] } ${ value }` );
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
          `[${ source }] expected for box.x: ${received.x} ${OPERATOR_MAP[snapshot.xOperator]} ${snapshot.xValue}` );
      }
      if ( isEnabled( snapshot, "yValue" ) && !y ) {
        return expectReturn( y,
          `[${ source }] expected for box.y: ${received.y} ${OPERATOR_MAP[snapshot.yOperator]} ${snapshot.yValue}` );
      }
      if ( isEnabled( snapshot, "wValue" ) &&!w ) {
        return expectReturn( w,
          `[${ source }] expected for box.width: `
            + `${received.width} ${OPERATOR_MAP[snapshot.wOperator]} ${snapshot.wValue}` );
      }
      if ( isEnabled( snapshot, "hValue" ) && !h ) {
        return expectReturn( h,
          `[${ source }] expected for box.height: ${received.height}`
            + ` ${OPERATOR_MAP[snapshot.hOperator]} ${snapshot.hValue}` );
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

        return expectReturn( totalWeight <= val, `[${ source }] expected `
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
        return expectReturn( assets.length <= val, `[${ source }] expected `
          + `total number of ${ type } assets to be under`
          + ` ${ val }, but found ${ assets.length  }` );
    },

    /**
     *
     * @param {Object} actual
     * @param {Object} expected
     * @param {String} source
     * @returns {Object}
     */
    toBeVisible( actual, expected, source ) {
        const pass = typeof expected.value !== "undefined"
        // support Puppetry@<3.0.0
        ? ( actual.isDisplayed === expected.value
          && actual.isVisible === expected.value
          && actual.isOpaque === expected.value
          && actual.isIntersecting === expected.value )
        : ( actual.isDisplayed === expected.isDisplayed
          && actual.isVisible === expected.isVisible
          && actual.isOpaque === expected.isOpaque
          && actual.isIntersecting === expected.isIntersecting );

        return expectReturn( pass, `[${ source }] expected the target element to be `
          + `${ visibleObjToString( expected ) }, but it is ${ visibleObjToString( actual ) }` );
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
        try {
          const GA = "Google Analytics";
          let matches, found;
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
              matches = filterGaBeacons( found, assert );
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
              found = beacons.filter( beacon => beacon.ec.action.name === "checkout" );
              validateGaBeacons( found, assert );
              return expectReturn( !!found.length,
                `[${ source }] expected to send "EC: Checkout" data to ${ GA }, but it is not sent` );

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
              found = beacons.filter( beacon => beacon.data.action === "add promo" );
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
              + `is above ${ counterpart } (y=${ b.y })` );
          }
          break;
        case "below":
          pass = a.y >= b.y + b.height;
          if ( !pass ) {
            return expectReturn( pass, `[${ source }] expected ${ target } (y=${ a.y }) is below ${ counterpart } `
              + `(y=${ b.y }, height=${ b.height }) ` );
          }
          break;
        case "left":
          pass = a.x + a.width <= b.x;
          if ( !pass ) {
            return expectReturn( pass, `[${ source }] expected ${ target } `
              + `(x=${ a.x }, width=${ a.width }) `
              + `is left to ${ counterpart } (x=${ b.x })` );
          }
          break;
        case "right":
          pass = a.x >= b.x + b.width;
          if ( !pass ) {
            return expectReturn( pass, `[${ source }] expected ${ target } (x=${ a.x }) is right to ${ counterpart } `
              + `(x=${ b.x }, width=${ b.width })` );
          }
          break;
      }
      return expectReturn( true, `` );
    }

  });


};