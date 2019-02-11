import log from "electron-log";
import { TestGeneratorError } from "error";

export default class TestGenerator {

  constructor( suite, schema, targets ) {
    this.schema = schema;
    this.suite = { ...suite };
    this.targets = Object.values( targets ).reduce( ( carry, entry ) => {
      carry[ entry.target ] = entry.selector;
      return carry;
    }, {});
  }

  parseTargets( targets ) {
    return Object.values( targets )
      .filter( ({ target, selector }) => Boolean( target ) && Boolean( selector ) )
      .map( this.schema.jest.tplQuery ).join( "\n" );
  }

  parseCommand = ( command ) => {
    const { target, method, params, assert } = command,
          src = target === "page" ? "page" : "element";
    try {
      if ( ! ( method in this.schema[ src ]) ) {
        return [];
      }
      return this.schema[ src ][ method ].template({
        target,
        assert,
        params,
        targetSeletor: this.targets[ target ],
        method
      });
    } catch ( err ) {
      console.warn( "parseCommand error:", err, command );
      log.warn( `Renderer process: TestGenerator.parseCommand: ${ err }` );
      throw new TestGeneratorError( `${ err.message } in ${ target }.${ method }` );
    }
  }

  parseTest = ( test ) => {
    const commands = Object.values( test.commands )
      .filter( record => record.disabled !== true );
    if ( !commands.length ) {
      return "";
    }

    const body = commands
      .map( this.parseCommand )
      .join( "\n" );
    return this.schema.jest.tplTest({
      title: test.title,
      body
    });
  }

  parseGroup = ( group, gInx ) => {
    const tests = Object.values( group.tests )
      .filter( test => test.disabled !== true );
    if ( !tests.length ) {
      return "";
      //throw new Error( `'groups.${gInx}.tests' shall not be empty` );
    }
    const body = tests
      .map( ( test, tInx ) => this.parseTest( test, tInx, gInx ) )
      .join( "\n" );

    return this.schema.jest.tplGroup({
      title: group.title,
      body
    });
  }

  generate() {
    try {
      return this.schema.jest.tplSuite({
        title: this.suite.title,
        targets: this.parseTargets( this.suite.targets ),
        body: Object.values( this.suite.groups )
          .filter( group => group.disabled !== true )
          .map( this.parseGroup )
          .join( "\n" )
      });
    } catch ( err ) {
      console.warn( "generate error:", err );
      log.warn( `Renderer process: TestGenerator.generate: ${ err }` );
      throw new TestGeneratorError( err.message );
    }
  }
}