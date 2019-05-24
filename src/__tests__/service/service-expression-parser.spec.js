import ExpressionParser from "../../service/ExpressionParser";


describe( "ExpressionParser", () => {
  let expParser;

  beforeEach(() => {
    expParser = new ExpressionParser({
      foo: "FOO",
      bar: "BAR"
    });
  });

  it( "parses {{ variable }}", () => {
    const res = expParser.parse( `{{ foo }}` );
    expect( res ).toBe( `FOO` );
  });

  it( "parses {{ random() }}", () => {
    const res = expParser.parse( `{{ random([ "a", "b", "c" ]) }}` );
    expect( res ).toBe( `(() => { const json = ["a","b","c"]; return json[ randomInt( json.length  ) ]; })()` );
  });

  it( "builds {{ faker() }}", () => {
    const expr = expParser.buildFakerDirective( "address.streetSuffix", "nb_NO" );
    expect( expr ).toBe( `{{ faker( "address.streetSuffix", "nb_NO" ) }}` );
  });

  it( "parses {{ faker() }}", () => {
    const expr = expParser.buildFakerDirective( "address.streetSuffix", "nb_NO" ),
          res = expParser.parse( expr );
    expect( res ).toBe( `(() => { faker.locale = "nb_NO"; return faker.address.streetSuffix(); })()` );
  });

});

