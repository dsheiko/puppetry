import ExpressionParser from "../../service/ExpressionParser";
const CID = "CID";

describe( "ExpressionParser", () => {
  let expParser;

  beforeEach( () => {
    expParser = new ExpressionParser( CID );
  });

  it( "parses {{variable}}", () => {
    const res = expParser.parseExp( `{{FOO}}` );
    expect( res ).toBe( `ENV[ "FOO" ]` );
  });

  it( "parses {{ variable }}", () => {
    const res = expParser.parseExp( `{{ FOO }}` );
    expect( res ).toBe( `ENV[ "FOO" ]` );
  });

  it( "parses no exp ", () => {
    const res = expParser.stringify( `some string` );
    expect( res ).toBe( `"some string"` );
  });

  it( "parses {{ FOO }} {{ BAR }}", () => {
    const res = expParser.stringify( `before_{{ FOO }}_{{ BAR }}_after` );
    expect( res ).toBe( "`before_${ ENV[ \"FOO\" ] }_${ ENV[ \"BAR\" ] }_after`" );
  });

   it( "parses {{ env() }}", () => {
    const res = expParser.parseExp( `{{ env("FOO") }}` );
    expect( res ).toBe( `process.env.FOO` );
  });

  it( `parses {{ htmlOf( "FOO" ) }}`, () => {
    let res;
    res = expParser.parseExp( `{{ htmlOf( "FOO" ) }}` );
    expect( res ).toBe( `await bs.target( await FOO() ).getProp( "innerHTML" )` );
  });

  it( `parses {{ attributeOf( "FOO", "foo" ) }}`, () => {
    let res;
    res = expParser.parseExp( `{{ attributeOf( "FOO", "foo" ) }}` );
    expect( res ).toBe( `await bs.target( await FOO() ).getAttr( "foo" )` );
  });

  it( `parses {{ propertyOf( "FOO", "foo" ) }}`, () => {
    let res;
    res = expParser.parseExp( `{{ propertyOf( "FOO", "foo" ) }}` );
    expect( res ).toBe( `await bs.target( await FOO() ).getProp( "foo" )` );
  });

  it( "parses {{ random() }}", () => {
    const res = expParser.parseExp( `{{ random([ "a", "b", "c" ]) }}` );
    expect( res ).toBe( `util.exp.random( ["a","b","c"] )` );
  });

  it( "parses {{ counter() }}", () => {
    let res;
    res = expParser.parseExp( `{{ counter() }}` );
    expect( res ).toBe( `util.exp.counter( "CID" )` );
  });


  it( "parses {{ iterate() }}", () => {
    let res;
    res = expParser.parseExp( `{{ iterate(["a", "b"]) }}` );
    expect( res ).toBe( `util.exp.iterate( ["a","b"], "CID" )` );
  });

  it( "builds {{ faker() }}", () => {
    const expr = expParser.buildFakerDirective( "address.streetSuffix", "nb_NO" );
    expect( expr ).toBe( `{{ faker( "address.streetSuffix", "nb_NO" ) }}` );
  });

  it( `parses {{ faker( "address.streetSuffix", "nb_NO" ) }}`, () => {
    const expr = expParser.buildFakerDirective( "address.streetSuffix", "nb_NO" ),
          res = expParser.parseExp( expr );
    expect( res ).toBe( `util.exp.fake( "address.streetSuffix", "nb_NO" )` );
  });

  it( `parses {{ faker( "address.streetSuffix" ) }}`, () => {
    const expr = expParser.buildFakerDirective( "address.streetSuffix" ),
          res = expParser.parseExp( expr );

    expect( res ).toBe( `util.exp.fake( "address.streetSuffix", "en" )` );
  });

});

