import { join } from "path";
import { message } from "antd";
import { writeFile, readFile } from "../io";
import { getSchema } from "component/Schema/schema";
import { extendToGherkin } from "service/utils";

const INDENT = "   ";

function printGherkin( txt ) {
  return txt.replace( /\n/gm, "" )
    .replace( /\s+/gm, ` ` )
    .replace( /`/gm, `"` );
}

export default class TextConvertor {

  constructor( input, onCommand = null ) {
    this.input = input;
    this.output = "";
    this.onCommand = onCommand;
    // map [ group_test_num ] = command_num
    this.commandRecLabels = {};
  }

  printLocalVariables = ( variables ) => {
    this.print( `local variables:`, 3 );
    Object.entries( variables ).forEach( pair => {
      this.print( `${ pair[ 0 ] } = ${ pair[ 1 ] }`, 4 );
    });
  }

  printTest = ( test, tInx, variables = {}) => {
    const testRecLabel = `${ tInx + 1 }.`;
    this.print( `\n` );
    this.print( `${ testRecLabel } test: ${ test.title }`, 1 );

    if ( variables && Object.keys( variables ).length ) {
      this.printLocalVariables( variables );
    }

    Object.values( test.commands )
      .filter( command => !command.disabled )
      .forEach( command => {
        if ( command.isRef ) {
          if ( !( command.ref in this.input.snippets ) ) {
            return ;
          }
          return this.printTest( this.input.snippets[ command.ref ], tInx, command.variables );
        }
        return this.printCommand( command, testRecLabel );
      });


  }

  printCommand = ( command, testRecLabel ) => {

    this.commandRecLabels[ testRecLabel ] = testRecLabel in this.commandRecLabels
      ? this.commandRecLabels[ testRecLabel ] + 1
      : 1;

    const schema = getSchema( command.target, command.method ),
          recordLabel = `${ testRecLabel }${ this.commandRecLabels[ testRecLabel ] }.`;

    this.onCommand && this.onCommand( command, recordLabel );

    if ( typeof schema.toGherkin === "function" ) {
      this.print( `${ recordLabel } ${ printGherkin( extendToGherkin( command, schema.toGherkin( command ) ) ) }`, 3 );
    } else {
      if ( command.waitForTarget ) {
        this.print( `${ recordLabel } ${ command.target }.waitForTarget()`, 3 );
      }
      this.print( `${ recordLabel } ${ command.target }.${ command.method }()`, 3 );
    }
    if ( command.comment ) {
      this.print( `▷ ${ command.comment }`, 4 );
    }
  }

  convertSuite( suite ) {

    this.print( `\n${ suite.title }` );
    this.print( `filename: ${ suite.filename }`, 1 );
    this.print( `timeout: ${ suite.timeout }\n`, 1 );

    this.print( `targets:`, 1 );

    const targets = { ...this.input.snippets.targets, ...suite.targets };
    Object.values( targets ).forEach( item => {
      if ( item.ref ) {
        this.print( `${ item.target } = ${ item.ref }`
          + `${ item.parentType ? `(${ item.parentType })` : `` } > ${ item.selector }`, 2 );
        return;
      }
      this.print( `${ item.target } = ${ item.selector }`, 2 );
    });

    this.print( `\n` );

    const tests = suite.tests || {};
    Object.values( tests )
      .filter( test => !test.disabled )
      .forEach( ( test, tInx ) => this.printTest( test, tInx ) );
  }

  print( text, level = 0 ) {
    const indentStr = INDENT.repeat( level );
    text.split( "\n" ).forEach( chunk => {
      this.output += indentStr + chunk + "\n";
    });
  }

  async convert() {
    try {
      this.print( this.input.project.name );
      this.print( `environment: ${ this.input.environment }\n` );
      this.print( `template variables:` );
      Object.entries( this.input.variables ).forEach( pair => {
        this.print( `${ pair[ 0 ] } = ${ pair[ 1 ] }`, 1 );
      });

      for ( const file of this.input.checkedList ) {
        const json = JSON.parse( await readFile( join( this.input.projectDirectory, file ), "utf8" ) );
        this.convertSuite( json );
      }

      const outputFile = join( this.input.selectedDirectory, "puppetry-export.txt" );
      await writeFile( outputFile, this.output );
      message.info( `Project exported as ${ outputFile }` );
      return outputFile;
    } catch ( err ) {
      console.error( err );
      throw err;
    }
  }

}