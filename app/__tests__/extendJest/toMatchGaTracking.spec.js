const fixture = {
  extend( ext ) {
    this.ext = ext;
  }
};
require( "../../../jest-pkg/lib/bootstrap/extendJest" )( fixture, {} );
const beacons = require( "./fixtures/beacons.json" );

describe( "expect.toMatchGaTracking", () => {

  test( "event #1 - common case", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "event",
        "categoryAssertion": "equals",
        "categoryValue": "Videos",
        "actionAssertion": "equals",
        "actionValue": "play",
        "labelAssertion": "equals",
        "labelValue": "Fall Campaign",
        "valueAssertion": "equals",
        "valueValue": 1,
        "nonInteractiveValue": false
      }, "page.assertGaTracking" );
    expect( res.pass ).toBe( true );
  });

  test( "event #2 - with nonInteractiveValue", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "event",
        "categoryAssertion": "equals",
        "categoryValue": "Videos",
        "actionAssertion": "equals",
        "actionValue": "stop",
        "labelAssertion": "equals",
        "labelValue": "Fall Campaign",
        "valueAssertion": "any",
        "nonInteractiveValue": true
      }, "page.assertGaTracking" );
    expect( res.pass ).toBe( true );
  });

  test( "event #3 - with invalid value", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "event",
        "categoryAssertion": "any",
        "actionAssertion": "any",
        "labelAssertion": "equals",
        "labelValue": "Invalid",
        "valueAssertion": "any",
        "nonInteractiveValue": false
      }, "page.assertGaTracking" );
    expect( res.pass ).toBe( false );
  });

  test( "social #1", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "social",
        "networkAssertion": "equals",
        "actionAssertion": "any",
        "targetAssertion": "equals",
        "networkValue": "Facebook",
        "targetValue": "https://puppetry.app"
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

   test( "social #2 - invalid", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "social",
        "networkAssertion": "contains",
        "networkValue": "Invalid",
        "actionAssertion": "any",
        "targetAssertion": "any"
      }, "page.assertGaTracking" );
    expect( res.pass ).toBe( false );
  });

  test( "screen #1", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "screenview",
        "screenNameAssertion": "equals",
        "appNameAssertion": "any",
        "appIdAssertion": "any",
        "appVersionAssertion": "any",
        "appInstallerIdAssertion": "any",
        "screenNameValue": "Home"
      }, "page.assertGaTracking" );

      expect( res.pass ).toBe( true );
  });

  test( "screen #2", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "screenview",
        "screenNameAssertion": "equals",
        "screenNameValue": "Docs",
        "appNameAssertion": "equals",
        "appNameValue": "Puppetry",
        "appIdAssertion": "equals",
        "appIdValue": "1234",
        "appVersionAssertion": "equals",
        "appVersionValue": "3.0.0",
        "appInstallerIdAssertion": "equals",
        "appInstallerIdValue": "1234"
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

  test( "timitg #1", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "timing",
        "nameAssertion": "equals",
        "valueAssertion": "equals",
        "categoryAssertion": "equals",
        "labelAssertion": "any",
        "nameValue": "load",
        "categoryValue": "JS Dependencies",
        "valueValue": "3549"
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

   test( "timitg #2", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "timing",
        "nameAssertion": "equals",
        "nameValue": "invalid",
        "valueAssertion": "any",
        "categoryAssertion": "any",
        "labelAssertion": "any"
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( false );
  });

  test( "exception #1", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "exception",
        "descriptionAssertion": "equals",
        "descriptionValue": "Demo exception thrown"
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

  test( "ecommerceAddItem", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "ecommerceAddItem",
        "idAssertion": "any",
        "nameAssertion": "any",
        "skuAssertion": "equals",
        "categoryAssertion": "any",
        "priceAssertion": "equals",
        "quantityAssertion": "any",
        "skuValue": "DD23444",
        "priceValue": "11.99"
      }, "page.assertGaTracking" );
    expect( res.pass ).toBe( true );
  });

  test( "ecommerceAddTransaction", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "ecommerceAddTransaction",
        "idAssertion": "equals",
        "affiliationAssertion": "equals",
        "revenueAssertion": "any",
        "taxAssertion": "any",
        "shippingAssertion": "any",
        "couponAssertion": "any",
        "idValue": "T12345",
        "affiliationValue": "Acme Clothing"
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

  test( "ecProductImpression", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "ecProductImpression",
        "idAssertion": "equals",
        "idValue": "P67890",
        "nameAssertion": "equals",
        "listAssertion": "equals",
        "brandAssertion": "equals",
        "categoryAssertion": "equals",
        "variantAssertion": "equals",
        "positionAssertion": "equals",
        "priceAssertion": "equals",
        "nameValue": "YouTube Organic T-Shirt",
        "categoryValue": "Apparel/T-Shirts",
        "brandValue": "YouTube",
        "variantValue": "gray",
        "listValue": "Search Results",
        "positionValue": 2,
        "priceValue": "40"
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

  test( "ecProductClick", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
         "action": "ecProductClick"
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

  test( "ecAddToCart", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "ecAddToCart",
        "productCountAssertion": "equals",
        "productCountValue": 1
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

  test( "ecRemoveFromCart", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "ecRemoveFromCart",
        "productCountAssertion": "equals",
        "productCountValue": 1
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

  test( "ecCheckout", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "ecCheckout",
        "stepAssertion": "equals",
        "optionAssertion": "any",
        "productCountAssertion": "equals",
        "stepValue": 2,
        "productCountValue": 1
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

  test( "ecRefund", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "ecRefund",
        "idAssertion": "equals",
        "affiliationAssertion": "any",
        "revenueAssertion": "any",
        "taxAssertion": "any",
        "shippingAssertion": "any",
        "couponAssertion": "any",
        "productCountAssertion": "any",
        "idValue": "T12345"
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

  test( "ecPurchase", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "ecPurchase",
        "idAssertion": "equals",
        "idValue": "T12345",
        "affiliationAssertion": "any",
        "revenueAssertion": "any",
        "taxAssertion": "any",
        "shippingAssertion": "any",
        "couponAssertion": "equals",
        "productCountAssertion": "any",
        "couponValue": "SUMMER2013"
      }, "page.assertGaTracking" );

    expect( res.pass ).toBe( true );
  });

  test( "ecPromotion", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "ecPromotion",
        "idAssertion": "equals",
        "idValue": "PROMO_1234",
        "productCountAssertion": "any",
        "nameAssertion": "any",
        "creativeAssertion": "any",
        "positionAssertion": "any"
      }, "page.assertGaTracking" );

console.log( res.pass, res.message());
    expect( res.pass ).toBe( true );
  });


});