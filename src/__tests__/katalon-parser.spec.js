import KatalonParser from "../service/KatalonParser";

function selenese( text ) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<TestCase>
<selenese>
	${ text }
</selenese>
</TestCase>`
}

function expectReturn( pass, errorMsg, vsMsg = null ) {
  const negativeErrorMsg = vsMsg || errorMsg.replace( " expected ", " not expected " );
  return {
    message: () => pass ? negativeErrorMsg : errorMsg,
    pass
  };
}

function checkProps( received, spec, pref ) {
  return Object.keys( spec ).reduce( ( carry, key ) => {
      if ( typeof spec[ key ] !== "string" && typeof spec[ key ] !== "number" ) {
        return carry;
      }
      if ( !( key in received ) ) {
        carry.push( `${ pref }.${ key } does not exist in received`);
      }
      if ( spec[ key ] !== received[ key ] ) {
        carry.push( `${ pref }.${ key } does not match of received`);
      }
      return carry;
    }, []);
}

expect.extend({
  toMatchCommand( received, spec ) {
    const errs = checkProps( received, spec, `command` );
    if ( "params" in spec ) {
      errs.concat( checkProps( received.params, spec.params, `command.params` ) );
    }
    return expectReturn( !errs.length, `${ errs[ 0 ] } ${ JSON.stringify( spec, null, "  " ) }` );
  }
});

let parser;

describe( "KatalonParser", () => {

  beforeEach(() => {
    parser = new KatalonParser();
  });

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

  describe( "parse", () => {

    it( "parses open", async () => {
      const res = await parser.parse( selenese(`
	<command>open</command>
	<target><![CDATA[https://www.google.com/]]></target>
	<value><![CDATA[]]></value>` ) );
      const [ command ] = res.commands;

      expect( command ).toMatchCommand({
        target: 'page',
        method: 'goto',
        params: {
          url: 'https://www.google.com/',
          timeout: 30000,
          waitUntil: "load"
        }
      });

    });

    it( "parses click", async () => {
      const res = await parser.parse( selenese(`
	<command>click</command>
	<target><![CDATA[link=Log In]]></target>
	<value><![CDATA[]]></value>` ) );
      const [ command ] = res.commands,
            [ target ] = Object.values( res.targets );

      expect( command ).toMatchCommand({
        target,
        method: "click",
        params: {
          button: "left",
          clickCount: 1,
          delay: 0
        }
      });

    });

    it( "parses doubleClick", async () => {
      const res = await parser.parse( selenese(`
	<command>doubleClick</command>
	<target><![CDATA[link=Log In]]></target>
	<value><![CDATA[]]></value>` ) );
      const [ command ] = res.commands,
            [ target ] = Object.values( res.targets );

      expect( command ).toMatchCommand({
        target,
        method: "click",
        params: {
          button: "left",
          clickCount: 2,
          delay: 0
        }
      });

    });

    it( "parses type", async () => {
      const res = await parser.parse( selenese(`
  <command>type</command>
	<target><![CDATA[id=firstNameInput]]></target>
	<value><![CDATA[Dzmitry]]></value>` ) );
      const [ command ] = res.commands,
            [ target ] = Object.values( res.targets );

      expect( command ).toMatchCommand({
        target,
        method: "type",
        params: {
          value: "Dzmitry"
        }
      });

    });


    it( "parses focus", async () => {
      const res = await parser.parse( selenese(`
  <command>focus</command>
	<target><![CDATA[id=firstNameInput]]></target>
	<value><![CDATA[]]></value>` ) );
      const [ command ] = res.commands,
            [ target ] = Object.values( res.targets );

      expect( command ).toMatchCommand({
        target,
        method: "focus"
      });

    });





  });
});
