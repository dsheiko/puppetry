import { tplGroup, tplTest, tplQuery, tplSuite } from "../component/Schema/Jest";


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

  describe( "tplQuery", () => {
    it( "returns valid JavaScript when plain values", () => {
      const code = tplQuery({ target: "FOO_BAR", selector: ".foo" });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
    it( "returns valid JavaScript when quoted values", () => {
      const code = tplQuery({ target: "FOO_BAR", selector: `*[name="Name"]` });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "tplSuite", () => {
    it( "returns valid JavaScript when plain values", () => {
      const code = tplSuite({ title: "FOO", body: "const a = 1;", targets: "const b = 1;" });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
    it( "returns valid JavaScript when quoted values", () => {
      const code = tplSuite({ title: `Foo "Bar"`, body: "const a = 1;", targets: "const b = 1;" });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });


});