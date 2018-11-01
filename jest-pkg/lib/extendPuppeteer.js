const { ElementHandle } = require( "puppeteer/lib/ExecutionContext" );

/**
 * Set value on a select element
 * @param {string} value
 * @returns {Promise<Undefined>}
 */
ElementHandle.prototype.select = async function( value ) {
  await this._page.evaluateHandle( ( el, value ) => {
      const event = new Event( "change", { bubbles: true });
      event.simulated = true;
      el.querySelector( `option[value="${ value }"]` ).selected = true;
      el.dispatchEvent( event );
  }, this, value );
};

/**
 * Check if element is visible in the DOM
 * @returns {Promise<Boolean>}
 **/
ElementHandle.prototype.isVisible = async function(){
  return ( await this.boundingBox() !== null );
};

/**
 * Get element attribute
 * @param {string} attr
 * @returns {Promise<String>}
 */
ElementHandle.prototype.getAttr = async function( attr ){
  const handle = await this._page.evaluateHandle( ( el, attr ) => el.getAttribute( attr ), this, attr );
  return await handle.jsonValue();
};

/**
 * Get element property
 * @param {string} prop
 * @returns {Promise<String>}
 */
ElementHandle.prototype.getProp = async function( prop ){
  const handle = await this._page.evaluateHandle( ( el, prop ) => el[ prop ], this, prop );
  return await handle.jsonValue();
};
