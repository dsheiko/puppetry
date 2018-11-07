/**
 * Parser for Katalon recorder
 * @see https://www.katalon.com/
 */

const { parseString } = require( "xml2js" ),
      { promisify } = require( "util" ),
      fs = require( "fs" ),
      readFile = promisify( fs.readFile ),
      parseStringAsync = promisify( parseString ),
      VAR_PREF = "ELH_";


export default class KatalonParser {

  constructor() {
    this.varCounter = 0;
    this.varMap = {};
  }

  static parseTarget( target ) {
    let content, matches, text;
    switch ( true ) {
    case target.startsWith( `name=` ):
      return `[name="${ target.replace( /^name=/, "" ) }"]`;
    case target.startsWith( `id=` ):
      return `#${ target.replace( /^id=/, "" ) }`;
    case target.startsWith( `xpath=` ):
      return target.replace( /^xpath=/, "" );
    case target.startsWith( `link=` ):
      content = target.replace( /^link=/, "" ).trim(); // get Reviews (2)
      // get 2  out of Reviews (2)
      matches = content.match( /\((\d)\)$/ );
      // get Reviews  out of Reviews (2)
      text = matches ? content.replace( matches[ 0 ], "" ).trim() : content;
      return matches
        ? `//a[text()="${ text }"][${ matches[ 0 ].replace( /\D/g, "" ) }]`
        : `//a[text()="${ text }"]`;
    default:
      return target;
    }

  }


  generateTarget( target ) {
    const selector = KatalonParser.parseTarget( target );
    if ( ! ( selector in this.varMap ) ) {
      this.varMap[ selector ] = `${ VAR_PREF }${ this.varCounter++ }`;
    }
    return this.varMap[ selector ];
  }

  onopen({ target }) {
    return {
      target: "page",
      method: "goto",
      params: { url: target }
    };
  }

  onclick({ target }) {
    return {
      target: this.generateTarget( target ),
      method: "click",
      params: { }

    };
  }

  async parse( xml ) {
    try {
      const json = await parseStringAsync( xml ),
            commands = json.TestCase.selenese.reduce( ( carry, entry ) => {
              const [ command ] = entry.command,
                    [ target ] = entry.target,
                    [ value ] = entry.value,

                    method = `on${ command }`;

              if ( method in this ) {
                carry.push( this[ method ]({ target, value }) );
              }
              return carry;
            }, []);
      return {
        targets: this.varMap,
        commands
      };
    } catch ( err ) {
      console.error( err );
    }
  }
}

//async function main() {
//  try {
//    const xml = await readFile( "test.xml", "utf8" ),
//          parser = new KatalonParser(),
//          out = await parser.parse( xml );
//
//    console.log( out );
//
//  } catch ( err ) {
//    console.error( err );
//  }
//}
//
//main();
