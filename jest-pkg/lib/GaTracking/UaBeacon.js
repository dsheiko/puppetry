const url = require( "url" ),
      BEACON_HOSTS = [
        "www.google-analytics.com",
        "ssl.google-analytics.com",
        "stats.g.doubleclick.net"
      ];

/**
 * Inspired by https://github.com/keithclark/gadebugger/blob/master/src/core/uaBeacon.js
 */
class UaBeacon {

  constructor( uri ) {
    this.params = {};
    ( new URL( uri ) ).searchParams.forEach(( val, name ) => {
      this.params[ name ] = val;
    });
  }

  static validateUrl( uri ) {
    const u = url.parse( uri );
    return u && BEACON_HOSTS.includes( u.hostname ) && (
      u.path.includes( "/collect" ) || u.path.includes( "/__utm.gif" )
    );
  }

  toJSON() {
    const type = this.type(),
          methods = [ "event", "social", "screenview", "timing", "exception" ];
    return {
      type,
      data: methods.includes( type ) ? this[ type ]() : {},
      ec: {
        impressions: this.ecImpressions(),
        promotions: this.ecPromotions(),
        currency: this.params.cu,
        action: {
          name: this.params.pa,
          data: this.actionFieldObject()
        },
        products: typeof this.params.pr1id !== "undefined" ? this.ecProducts() : []
      }
    };
  }

  type() {
    return this.params.t;
  }

  referrer() {
    return this.params.dr;
  }

  event() {
    return {
        category: this.params.ec,
        action: this.params.ea,
        label: this.params.el,
        value: this.params.ev,
        nonInteractive: this.params.ni === "1"
    };
  }

  social() {
    return {
        network: this.params.sn,
        action: this.params.sa,
        target: this.params.st
    };
  }

  screenview() {
    return {
        screenName: this.params.cd,
        appName: this.params.an
    };
  }

  timing() {
    return {
        name: this.params.utv,
        value: this.params.utt,
        category: this.params.utc
    };
  }

  exception() {
    return {
        description: this.params.exd,
        fatal: this.params.exf === "1"
    };
  }

  static getIndices( params, re ) {
    const indices = {};
    Object.keys( params )
      .filter( key => key.match( re ) )
      .forEach(( key ) => {
        const chunks = key.match( re );
        indices[ chunks[ 1 ] ] = true;
      });
    return indices;
  }

  ecImpressions() {
    if ( typeof this.params.il1pi1id === "undefined" ) {
      return [];
    }
    const indices = UaBeacon.getIndices( this.params, /^il1pi(\d+)/ );
    return Object.keys( indices ).map(( inx ) => this.impressionFieldObject( inx ));
  }

  ecProducts() {
    const indices = UaBeacon.getIndices( this.params, /^pr(\d+)/ );
    return Object.keys( indices ).map(( inx ) => this.productFieldObject( inx ));
  }

  ecPromotions() {
    if ( typeof this.params.promo1id === "undefined" ) {
      return [];
    }
    const indices = UaBeacon.getIndices( this.params, /^promo(\d+)/ );
    return Object.keys( indices ).map(( inx ) => this.promotionFieldObject( inx ));
  }

  promotionFieldObject( inx ) {
    return {
      id: this.params[ `promo${ inx }id` ],
      name: this.params[ `promo${ inx }nm` ]
    };
  }

  impressionFieldObject( inx ) {
    return {
      list: this.params[ `il1nm` ],
      id: this.params[ `il1pi${ inx }id` ],
      name: this.params[ `il1pi${ inx }nm` ],
      category: this.params[ `il1pi${ inx }ca` ],
      brand: this.params[ `il1pi${ inx }br` ],
      variant: this.params[ `il1pi${ inx }va` ],
      listPosition: this.params[ `il1pi${ inx }ps` ],
      price: this.params[ `il1pi${ inx }pr` ]
    };
  }

  productFieldObject( inx ) {
    return {
      id: this.params[ `pr${ inx }id` ],
      name: this.params[ `pr${ inx }nm` ],
      category: this.params[ `pr${ inx }ca` ],
      brand: this.params[ `pr${ inx }br` ],
      variant: this.params[ `pr${ inx }va` ],
      listPosition: this.params[ `pr${ inx }ps` ],
      price: this.params[ `pr${ inx }pr` ],
      quantity: this.params[ `pr${ inx }qt` ],
      coupon: this.params[ `pr${ inx }cc` ]
    };
  }

  actionFieldObject() {
    return {
      id: this.params.ti,
      affiliation: this.params.ta,
      revenue: this.params.tr,
      tax: this.params.tt,
      shipping: this.params.ts,
      coupon: this.params.tcc,
      list: this.params.pal,
      step: this.params.cos,
      option: this.params.col
    };
  }

}

module.exports = UaBeacon;