import ExpressionParser from "../../service/ExpressionParser";


describe( "ExpressionParser", () => {
  let expParser;

  beforeEach( () => {
    expParser = new ExpressionParser();
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

  it( "parses {{ random() }}", () => {
    const res = expParser.parseExp( `{{ random([ "a", "b", "c" ]) }}` );
    expect( res ).toMatch( /(a|b|c)/ );
  });

  it( "parses {{ counter() }}", () => {
    let res;
    res = expParser.parseExp( `{{ counter() }}` );
    expect( res ).toBe( "1" );
    res = expParser.parseExp( `{{ counter() }}` );
    expect( res ).toBe( "2" );
  });

  it( "parses {{ iterate() }}", () => {
    let res;
    res = expParser.parseExp( `{{ iterate(["a", "b"]) }}` );
    expect( res ).toBe( "a" );
    res = expParser.parseExp( `{{ iterate(["a", "b"]) }}` );
    expect( res ).toBe( "b" );
    res = expParser.parseExp( `{{ iterate(["a", "b"]) }}` );
    expect( res ).toBe( "a" );
  });

  it( "builds {{ faker() }}", () => {
    const expr = expParser.buildFakerDirective( "address.streetSuffix", "nb_NO" );
    expect( expr ).toBe( `{{ faker( "address.streetSuffix", "nb_NO" ) }}` );
  });

  it( `parses {{ faker( "address.streetSuffix", "nb_NO" ) }}`, () => {
    const expr = expParser.buildFakerDirective( "address.streetSuffix", "nb_NO" ),
          res = expParser.parseExp( expr );
    expect( typeof res ).toBe( "string" );
  });

  it( `parses {{ faker( "address.streetSuffix" ) }}`, () => {
    const expr = expParser.buildFakerDirective( "address.streetSuffix", "nb_NO" ),
          res = expParser.parseExp( expr );
    expect( typeof res ).toBe( "string" );
  });

});

