

function validateProductNumber( beacon, scope, expectedNum = false ) {
  if ( typeof expectedNum === "undefined" ) {
    expectedNum = false;
  }
  if ( expectedNum === false && !beacon.ec.products.length ) {
      throw new Error( `Number of products added in ${ scope } must be at least one, `
        + ` but found none` );
  }
  if ( expectedNum !== false && beacon.ec.products.length !== expectedNum ) {
      throw new Error( `Number of products added in ${ scope } must be ${ expectedNum }, `
        + ` but found ${ beacon.ec.products.length }` );
  }
}

function validate( data, fieldLenMap, scope ) {
  Object.keys( fieldLenMap )
    .filter( field => field in data )
    .forEach( field => {
    const spec = fieldLenMap[ field ];

    if ( "required" in spec && typeof data[ field ] === "undefined" ) {
      throw new Error( `Field "${ field }" in ${ scope } is required. `
        + `See https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference` );
    }

    if ( "number" in spec && isNaN( parseInt( data[ field ], 10 ) ) ) {
      throw new Error( `Value of "${ field }" field in ${ scope } must be a number. `
        + `See https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference` );
    }
    
    if ( "maxLen" in spec && data[ field ] && data[ field ].length > spec.maxLen ) {
      throw new Error( `Value of "${ field }" field in ${ scope } must have size < ${ spec.maxLen } bytes. `
        + `See https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference` );
    }
  });
}

const assertionMap = {
  event: {
    params: ["category","action","label","value","nonInteractive"],
    data: ( b ) => b.data,
    predicate: ( b ) => {
      validate( b.data, {
        category: { maxLen: 150, required: true },
        action: { maxLen: 500, required: true },
        label: { maxLen: 500 },
        value: { number: true }
      }, "Event" );
    }
  },
  social: {
    params: ["network","action","target"],
    data: ( b ) => b.data,
    predicate: ( b ) => {
      console.log("validate");
      validate( b.data, {
        network: { maxLen: 50 },
        action: { maxLen: 50 },
        target: { maxLen: 2048 }
      }, "Social Interactions" );
    }
  },
  screen: {
    params: ["screenName","appName","appId","appVersion","appInstallerId"],
    data: ( b ) => b.data,
    predicate: ( b ) => {
      validate( b.data, {
        screenName: { maxLen: 2048, required: true },
        appName: { maxLen: 100 },
        appId: { maxLen: 150 },
        appInstallerId: { maxLen: 150 },
        appVersion: { maxLen: 100 }
      }, "App / Screen Measurement" );
    }
  },
  timing: {
    params: ["var","value","category","label"],
    data: ( b ) => b.data,
    predicate: ( b ) => {
      validate( b.data, {
        category: { maxLen: 150, required: true },
        name: { maxLen: 500, required: true },
        value: { number: true, required: true },
        label: { maxLen: 500 }
      }, "Timings" );
    }
  },
  exception: {
    params: ["description"],
    data: ( b ) => b.data,
    predicate: ( b ) => {
      validate( b.data, {
        description: { maxLen: 150 }
      }, "Exception" );
    }
  },
  ecProductImpression: {
    params: ["description"],
    data: ( b ) => b.ec.impressions[ 0 ],
    predicate: ( b ) => {
      validate( b.ec.impressions[ 0 ], {
        id: { required: true },
        name: { required: true }
      }, "Product Impression" );

    }
  },
  ecProductClick: {
    params: [],
    data: ( b ) => b,
    predicate: ( b ) => {
      validateProductNumber( b, `Product Click` );
    }
  },
  ecProductDetails: {
    params: [],
    data: ( b ) => b,
    predicate: ( b ) => {
      validateProductNumber( b, `Product Details View` );
    }
  },
  ecAddToCart: {
    params: [],
    data: ( b ) => b,
    predicate: ( b, assert ) => {
      validateProductNumber( b, `Add Product to Cart`, assert.productCountValue );
    }
  },
  ecRemoveFromCart: {
    params: [],
    data: ( b ) => b,
    predicate: ( b, assert ) => {
      validateProductNumber( b, `Remove Product from Cart`, assert.productCountValue );
    }
  },
  ecCheckout: {
    params: [ "step", "option" ],
    data: ( b ) => b.ec.action.data,
    predicate: ( b, assert ) => {
      validateProductNumber( b, `Checkout`, assert.productCountValue );
      validate( b.ec.action.data, {
        step: { number: true }
      }, "Checkout" );
    }
  },
  ecRefund: {
    params: [ "id", "affiliation", "revenue", "tax", "shipping", "coupon" ],
    data: ( b ) => b.ec.action.data,
    predicate: ( b, assert ) => {
      typeof assert.productCountValue !== "undefined"
        && validateProductNumber( b, `Refund`, assert.productCountValue );
      validate( b.ec.action.data, {
        id: { required: true }
      }, "Refund" );
    }
  },

  ecPurchase: {
    params: [ "id", "affiliation", "revenue", "tax", "shipping", "coupon" ],
    data: ( b ) => b.ec.action.data,
    predicate: ( b, assert ) => {
      validateProductNumber( b, `Purchase`, assert.productCountValue );
      validate( b.ec.action.data, {
        id: { number: true }
      }, "Purchase" );
    }
  },

  ecPromotion: {
    params: [ "id", "name", "creative", "position" ],
    data: ( b ) => b.ec.promotions[ 0 ],
    predicate: ( b, assert ) => {
      validateProductNumber( b, `Promotion`, assert.productCountValue );
      validate( b.ec.promotions[ 0 ], {
        id: { required: true }
      }, "Promotion" );
    }
  },

  ecommerceAddItem: {
    params: [ "id", "name", "sku", "category", "price", "quantity" ],
    data: ( b ) => b.data,
    predicate: ( b ) => {
      validate( b.data, {
        id: { required: true },
        name: { required: true }
      }, "Adding an Item" );
    }
  },

  ecommerceAddTransaction: {
    params: [ "id", "affiliation", "revenue", "tax", "shipping", "coupon" ],
    data: ( b ) => b.data,
    predicate: ( b ) => {
      validate( b.data, {
        id: { required: true }
      }, "Adding a Transaction" );
    }
  }
};

exports.assertionMap = assertionMap;

const OP_MAP = {
  equals: "=",
  contains: "~"
};

exports.valsToString = function( assert ) {
  const vals = assertionMap[ assert.action ].params.map( key => assert[ `${ key }Value` ] );
  return assertionMap[ assert.action ].params
    .filter( prop => assert[ `${ prop }Assertion` ] !== "any" )
    .map( prop => {
      const val = assert[ `${ prop }Value` ],
            op = OP_MAP[ assert[ `${ prop }Assertion` ] ] || "=";
      return `${ prop } ${ op } "${ prop === "nonInteraction" ? JSON.stringify( Boolean( val ) ) : val }"`;
    })
    .join( ", " );
};

/**
* Find any beacons that comply the given restrictions
* @param {Object[]} beacons
* @param {Object} assert
* @returns {Array}
*/
exports.filterGaBeacons = function( beacons, assert ) {
  const props = assertionMap[ assert.action ].params,
        activeProps = props.filter( prop => assert[ `${ prop }Assertion`] !== "any" );

  return beacons.filter( beacon => {
    const data = assertionMap[ assert.action ].data( beacon );

    return activeProps.every( prop => {
      const rawVal = assert[ `${ prop }Value`];
      if ( typeof rawVal === "undefined" ) {
        return true;
      }
      // Boolean
      if ( prop === "nonInteractive" ) {
        return data[ prop ] === rawVal;
      }

      const expectedVal = String( assert[ `${ prop }Value`] ).trim(),
            actualVal = String( data[ prop ] ).trim();

      return assert[ `${ prop }Assertion`] === "contains"
       ? actualVal.includes( expectedVal )
       : actualVal === expectedVal;
    });
  });
};


exports.validateGaBeacons = function( beacons, assert ) {
  beacons.forEach( beacon => assertionMap[ assert.action ].predicate( beacon, assert ) );
};