import { join } from "path";
import { message } from "antd";
import { writeFile, readFile } from "../io";
import { getSchema } from "component/Schema/schema";

const INDENT = "   ";

function printGherkin( txt ) {
  return txt.replace( /\n/gm, "" )
    .replace( /\s+/gm, ` ` )
    .replace( /\`/gm, `"` );
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

  printTest = ( test, tInx, gInx, variables = {} ) => {
    const groupTestRecLabel = `${ gInx + 1 }.${ tInx + 1 }.`;
    if ( test.groupId !== "snippets" ) {
      this.print( `\n` );
      this.print( `${ groupTestRecLabel } test: ${ test.title }`, 2 );
    }

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
          return this.printTest( this.input.snippets[ command.ref ], tInx, gInx, command.variables );
        }
        return this.printCommand( command, groupTestRecLabel );
      });



  }

  printCommand = ( command, groupTestRecLabel ) => {

    this.commandRecLabels[ groupTestRecLabel ] = groupTestRecLabel in this.commandRecLabels
      ? this.commandRecLabels[ groupTestRecLabel ] + 1
      : 1;

    const schema = getSchema( command.target, command.method ),
          recordLabel = `${ groupTestRecLabel }${ this.commandRecLabels[ groupTestRecLabel ] }.`;

    this.onCommand && this.onCommand( command, recordLabel );

    if ( typeof schema.toGherkin === "function" ) {
      this.print( `${ recordLabel } ${ printGherkin( schema.toGherkin( command ) ) }`, 3 );
      return;
    }
    const addOn = typeof schema.toLabel === "function" ? schema.toLabel( command ) : "()";
    this.print( `${ recordLabel } ${ command.target }.${ command.method }${ addOn }`, 3 );
  }

  convertSuite( suite ) {

    this.print( `\n${ suite.title }` );
    this.print( `filename: ${ suite.filename }`, 1 );
    this.print( `timeout: ${ suite.timeout }\n`, 1 );

    this.print( `targets:`, 1 );

    const targets = { ...this.input.snippets.targets, ...suite.targets };
    Object.values( targets ).forEach( item => {
      this.print( `${ item.target } = ${ item.selector }`, 2 );
    });

    this.print( `\n` );

    Object.values( suite.groups )
      .filter( group => !group.disabled )
      .forEach( ( group, gInx ) => {
        this.print( `${ gInx + 1 }. describe: ${ group.title }`, 1 );
        Object.values( group.tests )
          .filter( test => !test.disabled )
          .forEach( ( test, tInx ) => this.printTest( test, tInx, gInx ) );
      });
  }

  print( text, level = 0 ) {
    const indentStr = INDENT.repeat( level );
    text.split( "\n" ).forEach( chunk => {
      this.output += indentStr + chunk + "\n";
    });
  }

  async convert() {

    this.print( this.input.project.name );
    this.print( `environment: ${ this.input.environment }\n`);
    this.print( `template variables:`);
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
  }

}