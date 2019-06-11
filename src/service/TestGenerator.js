import log from "electron-log";
import { join } from "path";
import { TestGeneratorError } from "error";
import { COMMAND_ID_COMMENT, RUNNER_PUPPETRY, SNIPPETS_GROUP_ID } from "constant";

export default class TestGenerator {

  constructor( suite, schema, targets, runner, projectDirectory, snippets, env ) {
    this.schema = schema;
    this.suite = { ...suite };
    this.projectDirectory = projectDirectory;
    this.snippets = { targets: {}, groups: {}, ...snippets };
    this.env = env;
    this.runner = runner; // RUNNER_PUPPETRY when embedded
    this.targets = Object.values({ ...snippets.targets, ...targets })
      .reduce( ( carry, entry ) => {
        carry[ entry.target ] = entry.selector;
        return carry;
      }, {});
  }

  parseTargets( targets ) {
    return Object.values( targets )
      .filter( ({ target, selector }) => Boolean( target ) && Boolean( selector ) )
      .map( this.schema.jest.tplQuery ).join( "\n" );
  }

  /**
   * @param {string} ref
   * @param {object} variables
   * @returns {string}
   */
  parseRef = ( ref, variables ) => {
    const groups = this.snippets.groups;
    if ( !groups.hasOwnProperty( SNIPPETS_GROUP_ID ) ) {
      return ``;
    }
    const tests = groups[ SNIPPETS_GROUP_ID ].tests;
    if ( !tests.hasOwnProperty( ref ) ) {
      return ``;
    }
    const test = tests[ ref ],
          env = ( variables && Object.keys( variables ).length )
              ? `      Object.assign( ENV, ${ JSON.stringify( variables ) } );\n` : ``,
          chunk = Object.values( test.commands )
            .map( this.parseCommand ).join( "\n" );
    return `      // SNIPPET ${ test.title }: START\n${ env }${ chunk }\n      // SNIPPET ${ test.title }: END\n`;
  }

   /**
   * @param {Object} command
   * @returns {string}
   */
  parseCommand = ( command ) => {
    const { isRef, ref, target, method, params, assert, variables, disabled } = command,
          src = target === "page" ? "page" : "element";
    if ( disabled ) {
      return ``;
    }
    if ( isRef ) {
      return this.parseRef( ref, variables );
    }
    try {
      if ( ! ( method in this.schema[ src ]) ) {
        return ``;
      }
      const chunk = this.schema[ src ][ method ].template({
        target,
        assert,
        params,
        targetSeletor: this.targets[ target ],
        method,
        id: command.id
      });
      // Provide source code with markers
      return this.runner === RUNNER_PUPPETRY
        ? `${ COMMAND_ID_COMMENT }${ command.groupId }:${ command.testId }:${ command.id }\n${ chunk }`
        : chunk;
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
        suite: this.suite,
        runner: this.runner,
        env: this.env,
        screenshotDirectory: join( this.projectDirectory, "screenshots" ),
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