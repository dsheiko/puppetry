const assertionMap = {
  event: {
    params: ["category","action","label","value","nonInteractive"],
    data: ( b ) => b.data
  },
  social: {
    params: ["network","action","target"],
    data: ( b ) => b.data
  },
  screen: {
    params: ["screenName","appName","appId","appVersion","appInstallerId"],
    data: ( b ) => b.data
  },
  timing: {
    params: ["var","value","category","label"],
    data: ( b ) => b.data
  },
  exception: {
    params: ["description"],
    data: ( b ) => b.data
  },
  ecProductImpression: {
    params: ["description"],
    data: ( b ) => b.ec.impressions[ 0 ]
  }
};

exports.assertionMap = assertionMap;

const OP_MAP = {
  equals: "=",
  contains: "~"
};

exports.valsToString = function( assert ) {
  const vals = assertionMap[ assert.action ].params.map( key => assert[ `${ key }Value` ] );
  assertionMap[ assert.action ].params
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
    return activeProps.every( prop => {
      const data = assertionMap[ assert.action ].data( beacon );
      // Boolean
      if ( prop === "nonInteraction" ) {
        return data[ prop ] === assert[ `${ prop }Value`];
      }
      const value = String( assert[ `${ prop }Value`] );
      return assert[ `${ prop }Assertion`] === "contains"
       ? data[ prop ].includes( value )
       : data[ prop ] === value;
    });
  });
};