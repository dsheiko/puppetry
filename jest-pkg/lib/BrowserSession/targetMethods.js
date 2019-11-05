/**
 *
 * @param {Page} page
 * @returns {Function}
 */
module.exports = function( page ) {
  /**
   *
   * @param {ElementHandle} elementHandle
   * @returns {Function}
   */
  return function( elementHandle ) {
    return {

      /**
       * Get element property
       * @param {string} prop
       * @returns {Promise<string>}
       */
      getProp: async function( prop ) {
        const propertyHandle = await elementHandle.getProperty( prop );
        return await propertyHandle.jsonValue();
      },

      /**
       * Get element attribute
       * @param {string} attr
       * @returns {Promise<string>}
       */
      getAttr: async function( attr ){
        const handle = await page.evaluateHandle( ( el, attr ) => el.getAttribute( attr ), elementHandle, attr );
        return await handle.jsonValue();
      },

      /**
       * Does element have attribute
       * @param {string} attr
       * @returns {Promise<string>}
       */
      hasAttr: async function( attr ){
        const handle = await page.evaluateHandle( ( el, attr ) => el.hasAttribute( attr ), elementHandle, attr );
        return await handle.jsonValue();
      },

      /**
       * Check if element is visible in the DOM
       * @returns {Promise<Object>}
       **/
      isVisible: async function(){
        if ( elementHandle === false ) {
          return {
            isAvailable: false
          };
        }
        const isIntersectingViewport = await elementHandle.isIntersectingViewport(),
              handleOpacity = await page.evaluateHandle( ( el ) =>
                window.getComputedStyle( el, null ).getPropertyValue( "opacity" ), elementHandle ),
              handleVisibility = await page.evaluateHandle( ( el ) =>
                window.getComputedStyle( el, null ).getPropertyValue( "visibility" ), elementHandle ),
              handleDisplay = await page.evaluateHandle( ( el ) =>
                window.getComputedStyle( el, null ).getPropertyValue( "display" ), elementHandle ),
              opacity = parseFloat( await handleOpacity.jsonValue() ),
              visibility = await handleVisibility.jsonValue(),
              display = await handleDisplay.jsonValue();

        return {
          isAvailable: true,
          display,
          visibility,
          opacity,
          isIntersecting: isIntersectingViewport
        };
      },

      /**
        * Set value on a select element
        * @param {string} value
        * @returns {Promise<Undefined>}
        */
       select: async function( value ) {
         await page.evaluateHandle( ( el, value ) => {
             const event = new Event( "change", { bubbles: true });
             event.simulated = true;
             el.querySelector( `option[value="${ value }"]` ).selected = true;
             el.dispatchEvent( event );
         }, elementHandle, value );
       }

    };
  };
};