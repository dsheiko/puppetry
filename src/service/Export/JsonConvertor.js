import { join } from "path";
import { message } from "antd";
import { writeFile, readFile } from "../io";

export default class JsonConvertor {

  constructor( input ) {
    this.input = input;
    this.output = {};
  }

  static targetsToJSON( targets ) {
    return Object.values( targets ).map( item => ({
      target: item.target,
      selector: item.selector
    }) );
  }

  static commandToJson( command ) {
    return ({
      target: command.target,
      method: command.method,
      params: command.params,
      assert: command.assert
    });
  }

  static snippetCommandsToJson = ( test ) => Object.values( test.commands )
    .filter( command => !command.disabled )
    .map( command => {
      return JsonConvertor.commandToJson( command );
    })

  testToJson = ( test ) => {
    let variables = {};
    const commands = Object.values( test.commands )
      .filter( command => !command.disabled )
      .reduce( ( carry, command ) => {
        if ( command.isRef ) {
          if ( !( command.ref in this.input.snippets ) ) {
            return carry;
          }
          variables = command.variables;
          const commands = JsonConvertor.snippetCommandsToJson( this.input.snippets[ command.ref ]);
          return carry.concat( commands );
        }
        carry.push( JsonConvertor.commandToJson( command ) );
        return carry;
      }, []);
    return {
      title: test.title,
      variables,
      commands
    };
  }

  groupsToJSON = ( groups ) => {
    return Object.values( groups )
      .filter( item => !item.disabled )
      .map( item => ({
        title: item.title,
        tests: Object.values( item.tests )
          .filter( test => !test.disabled )
          .map( this.testToJson )
      }) );
  }

  convertSuite( suite ) {
    this.output.suites.push({
      title: suite.title,
      timeout: suite.timeout,
      filename: suite.filename,
      targets: JsonConvertor.targetsToJSON( suite.targets ),
      groups: this.groupsToJSON( suite.groups )
    });
  }

  async convert() {
    this.output = {
      apiVersion: "1.0.0",
      puppetryVersion: this.input.project.puppetry,
      project: this.input.project.name,
      environment: this.input.environment,
      variables: this.input.variables
    };

    this.output.suites = [];
    for ( const file of this.input.checkedList ) {
      const json = JSON.parse( await readFile( join( this.input.projectDirectory, file ), "utf8" ) );
      this.convertSuite( json );
    }
    const outputFile = join( this.input.selectedDirectory, "puppetry-export.json" );
    await writeFile( outputFile, JSON.stringify( this.output, null, 2 ) );
    message.info( `Project exported as ${ outputFile }` );

  }

}