import { buildShadowDomQuery, tplGroup, tplTest, tplQuery, tplSuite } from "../../../component/Schema/Jest";

const FIX_FOO = { target: "FOO", selector: ".foo", css: true },
      FIX_BAR = { target: "BAR", selector: ".bar", ref: "FOO", parentType: "shadowHost", css: true },
      FIX_BAZ = { target: "BAZ", selector: ".baz", ref: "BAR", parentType: "shadowHost", css: true },
      FIX_QUX = { target: "QUX", selector: ".qux", ref: "FOO", parentType: "iframe", css: true },
      FIX_QUZ = { target: "QUZ", selector: ".quz", ref: "FOO", parentType: "", css: true };

describe( "Schema.Jest", () => {

  describe( "tplGroup", () => {
    it( "returns valid JavaScript when plain values", () => {
      const code = tplGroup({ title: "FOO", body: "return true;" });
      expect( code ).toEqual( expect.stringContaining( `describe( "FOO"` ) );
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
    it( "returns valid JavaScript when quoted values", () => {
      const code = tplGroup({ title: `BAR "foo"`, body: "return true;" });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "tplTest", () => {
    it( "returns valid JavaScript when plain values", () => {
      const code = tplTest({ title: "FOO", body: "return true;" });
      expect( code ).toEqual( expect.stringContaining( `test( "FOO", async ()` ) );
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
    it( "returns valid JavaScript when quoted values", () => {
      const code = tplTest({ title: `Bar "Foo"`, body: "return true;" });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "tplSuite", () => {
    it( "returns valid JavaScript when plain values", () => {
      const code = tplSuite({ title: "FOO", body: "const a = 1;", targets: "const b = 1;",
        suite: { timeout: 5000 }, interactive: false, options: { interactiveMode: false }
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
    it( "returns valid JavaScript when quoted values", () => {
      const code = tplSuite({ title: `Foo "Bar"`, body: "const a = 1;", targets: "const b = 1;",
        suite: { timeout: 5000 }, interactive: false, options: { interactiveMode: false }
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "buildShadowDomQuery", () => {
    test( "single target", () => {
      const res = buildShadowDomQuery( [ FIX_FOO ] );
      expect( res ).toEqual( `await bs.page.evaluateHandle('document.querySelector( ".foo" )')` );
    });
    test( "double target", () => {
      const res = buildShadowDomQuery( [ FIX_BAR, FIX_FOO ] );
      expect( res ).toEqual( `await bs.page.evaluateHandle('document.querySelector( ".bar" ).shadowRoot.querySelector( ".foo" )')` );
    });
    test( "triple target", () => {
      const res = buildShadowDomQuery( [ FIX_BAZ, FIX_BAR, FIX_FOO ] );
      expect( res ).toEqual( `await bs.page.evaluateHandle('document.querySelector( ".baz" ).shadowRoot.querySelector( ".bar" ).shadowRoot.querySelector( ".foo" )')` );
    });
  });

  describe( "tplQuery", () => {
    test( "with shadow DOM", () => {
      const res = tplQuery( [ FIX_BAR, FIX_FOO ] );
      expect( res.includes( `await bs.queryChain` ) ).toBe( true );
    });
    test( "with iframe", () => {
      const res = tplQuery( [ FIX_QUX, FIX_FOO ] );
      expect( res.includes( `await bs.queryChain` ) ).toBe( true );
    });
    test( "with generic", () => {
      const res = tplQuery( [ FIX_QUZ, FIX_FOO ] );
      expect( res.includes( `await bs.queryChain` ) ).toBe( true );
    });
  });


});