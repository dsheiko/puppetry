import * as method from "../../selector/selectors";

const FIX_FOO = { target: "FOO", selector: ".foo" },
      FIX_BAR = { target: "BAR", selector: ".bar", ref: "FOO", parentType: "css" },
      FIX_BAZ = { target: "BAZ", selector: ".baz", ref: "BAR", parentType: "css" },
      FIX_CHAIN = { FOO: FIX_FOO, BAR: FIX_BAR, BAZ: FIX_BAZ };

describe( "Selectors", () => {

    test( "getTargetChain with headless target", () => {
      const res = method.getTargetChain( FIX_FOO, FIX_CHAIN );
      expect( res.length ).toEqual( 1 );
      expect( res[ 0 ].target ).toEqual( "FOO" );
    });

    test( "getTargetChain with local target", () => {
      const res = method.getTargetChain( FIX_BAR, FIX_CHAIN );
      expect( res.length ).toEqual( 2 );
      expect( res[ 0 ].target ).toEqual( "FOO" );
      expect( res[ 1 ].target ).toEqual( "BAR" );
    });

    test( "getTargetChain with recursive local target", () => {
      const res = method.getTargetChain( FIX_BAZ, FIX_CHAIN );
      expect( res.length ).toEqual( 3 );
      expect( res[ 0 ].target ).toEqual( "FOO" );
      expect( res[ 1 ].target ).toEqual( "BAR" );
      expect( res[ 2 ].target ).toEqual( "BAZ" );
    });

});