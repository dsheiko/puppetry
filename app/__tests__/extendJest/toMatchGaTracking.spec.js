const fixture = {
  extend( ext ) {
    this.ext = ext;
  }
};
require( "../../../jest-pkg/lib/bootstrap/extendJest" )( fixture, {} );
const beacons = require( "./fixtures/beacons.json" );

describe( "expect.toMatchGaTracking", () => {

//  test( "event #1 - common case", () => {
//    const res = fixture.ext.toMatchGaTracking( beacons, {
//        "action": "event",
//        "categoryAssertion": "equals",
//        "categoryValue": "Videos",
//        "actionAssertion": "equals",
//        "actionValue": "play",
//        "labelAssertion": "equals",
//        "labelValue": "Fall Campaign",
//        "valueAssertion": "equals",
//        "valueValue": 1,
//        "nonInteractiveValue": false
//      }, "page.assertGaTracking" );
//    expect( res.pass ).toBe( true );
//  });
//
//  test( "event #2 - with nonInteractiveValue", () => {
//    const res = fixture.ext.toMatchGaTracking( beacons, {
//        "action": "event",
//        "categoryAssertion": "equals",
//        "categoryValue": "Videos",
//        "actionAssertion": "equals",
//        "actionValue": "stop",
//        "labelAssertion": "equals",
//        "labelValue": "Fall Campaign",
//        "valueAssertion": "any",
//        "valueValue": 1,
//        "nonInteractiveValue": true
//      }, "page.assertGaTracking" );
//    expect( res.pass ).toBe( true );
//  });
//
//  test( "event #3 - with invalid value", () => {
//    const res = fixture.ext.toMatchGaTracking( beacons, {
//        "action": "event",
//        "categoryAssertion": "any",
//        "actionAssertion": "any",
//        "labelAssertion": "equals",
//        "labelValue": "Invalid",
//        "valueAssertion": "any",
//        "nonInteractiveValue": false
//      }, "page.assertGaTracking" );
//    expect( res.pass ).toBe( false );
//  });
//
//  test( "social #1", () => {
//    const res = fixture.ext.toMatchGaTracking( beacons, {
//        "action": "social",
//        "networkAssertion": "equals",
//        "actionAssertion": "any",
//        "targetAssertion": "equals",
//        "networkValue": "Facebook",
//        "targetValue": "https://puppetry.app"
//      }, "page.assertGaTracking" );
//
//    expect( res.pass ).toBe( true );
//  });
//
//   test( "social #2 - invalid", () => {
//    const res = fixture.ext.toMatchGaTracking( beacons, {
//         "action": "social",
//        "networkAssertion": "contains",
//        "networkValue": "Invalid",
//        "actionAssertion": "any",
//        "targetAssertion": "any"
//      }, "page.assertGaTracking" );
//    expect( res.pass ).toBe( false );
//  });

     test( "screen #1 - invalid", () => {
    const res = fixture.ext.toMatchGaTracking( beacons, {
        "action": "screen",
        "screenNameAssertion": "equals",
        "appNameAssertion": "any",
        "appIdAssertion": "any",
        "appVersionAssertion": "any",
        "appInstallerIdAssertion": "any",
        "screenNameValue": "Home"
      }, "page.assertGaTracking" );
    console.log( res.pass, res.message());
    //expect( res.pass ).toBe( false );
  });


});