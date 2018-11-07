import KatalonParser from "../service/KatalonParser";

let parser;

describe( "KatalonParser", () => {

//  beforeEach(() => {
//    parser = new KatalonParser();
//  });

  describe( "parseTarget", () => {

    it( "parses id=email", () => {
      const res = KatalonParser.parseTarget( `id=email` );
      expect( res ).toEqual( `#email` );
    });

    it( "parses name=email", () => {
      const res = KatalonParser.parseTarget( `name=email` );
      expect( res ).toEqual( `[name="email"]` );
    });

    it( "parses xpath=...", () => {
      const res = KatalonParser.parseTarget(
        `xpath=(.//*[normalize-space(text()) and normalize-space(.)='Support'])[1]/following::a[1]` );

      expect( res ).toEqual( `(.//*[normalize-space(text()) and normalize-space(.)='Support'])[1]/following::a[1]` );
    });

    it( "parses link=Marketplace", () => {
      const res = KatalonParser.parseTarget( `link=Marketplace` );
      expect( res ).toEqual( `//a[text()="Marketplace"]` );
    });

    it( "parses link=Marketplace", () => {
      const res = KatalonParser.parseTarget( `link=Reviews (2)` );
      expect( res ).toEqual( `//a[text()="Reviews"][2]` );
    });


  });


});
