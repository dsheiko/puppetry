const url = require( "url" ),
      RE_PARAMS = /[?&]([a-z][a-z0-9]*)=([^&]*)/g,
      BEACON_HOSTS = [
        "www.google-analytics.com",
        "ssl.google-analytics.com",
        "stats.g.doubleclick.net"
      ];

/**
 *
 * @param {RegExp} re
 * @param {Object} data
 * @returns {Object}
 */
function parseDataToObject( re, data ) {
    let keyValue, obj = {};
    while (( keyValue = re.exec( data ) ) ) {
      obj[ keyValue[ 1 ] ] = decodeURIComponent( keyValue[ 2 ] );
    }
    return obj;
}

/**
 * Inspired by https://github.com/keithclark/gadebugger/blob/master/src/core/uaBeacon.js
 */
class UaBeacon {

  constructor( uri ) {
    this.params = parseDataToObject( RE_PARAMS, uri );
  }

  static validateUrl( uri ) {
    const u = url.parse( uri );
    return u && BEACON_HOSTS.includes( u.hostname ) && (
      u.path.includes( "/collect" ) || u.path.includes( "/__utm.gif" )
    );
  }

  toJSON() {
    const type = this.type(),
          methods = [ "event", "transaction", "item", "social" ];
    return {
      type,
      data: methods.includes( type ) ? this[ type ]() : {}
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

  campaignData() {
    if ( !this.params.cn && !this.params.cs && !this.params.cm ) {
      return null;
    }
    return {
        name: this.params.cn,
        source: this.params.cs,
        medium: this.params.cm,
        content: this.params.cc,
        term: this.params.ck
    };
  }

  transaction() {
    return {
        id: parseInt( this.params.ti, 10 ),
        affiliation: this.params.ta,
        revenue: parseFloat( this.params.tr ) || 0,
        shipping: parseFloat( this.params.ts ) || 0,
        tax: parseFloat( this.params.tt ) || 0,
        currency: this.params.cu
    };
  }

  item() {
    return {
        transactionId: parseInt( this.params.ti, 10 ),
        sku: this.params.ic,
        name: this.params.in,
        category: this.params.iv,
        price: parseFloat( this.params.ip ),
        quantity: parseInt( this.params.iq, 10 ),
        currency: this.params.cu
    };
  }
}

module.exports = UaBeacon;