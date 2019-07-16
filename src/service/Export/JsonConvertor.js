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

  static groupsToJSON( groups ) {
    return Object.values( groups ).map( item => ({
      title: item.title,
      tests: Object.values( item.tests ).map( test => ({
        title: test.title,
        commands: Object.values( test.commands ).map( command => ({
          target: command.target,
          method: command.method,
          params: command.params,
          assert: command.assert,
          ref: command.ref,
          variables: command.variables
        }) )
      }) )
    }) );
  }

  convertSnippets() {
    this.output.snippets = {
      targets: JsonConvertor.targetsToJSON( this.input.snippets.targets ),
      groups: JsonConvertor.groupsToJSON( this.input.snippets.groups )
    };
  }

  convertSuite( suite ) {
    this.output.suites.push({
      title: suite.title,
      timeout: suite.timeout,
      filename: suite.filename,
      targets: JsonConvertor.targetsToJSON( suite.targets ),
      groups: JsonConvertor.groupsToJSON( suite.groups )
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
    this.convertSnippets();
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