import log from "electron-log";
import { join } from "path";
import { TestGeneratorError } from "error";
import { COMMAND_ID_COMMENT, RUNNER_PUPPETRY, SNIPPETS_GROUP_ID } from "constant";
import { getTargetChain, getActiveTargets } from "selector/selectors";
import { mapSelectors } from "service/selector";
import { renderTarget } from "service/utils";

const INTERATIVE_TIMEOUT = 900000, // 15 min
      INTERACTIVE_ILLEGAL_METHODS = [ "setViewport" ];

export default class TestGenerator {
  /**
   * {Object} targets
   */
  constructor({
    suite, schema, targets, runner, projectDirectory, outputDirectory, snippets, sharedTargets, env, options
  }) {

    // collect here information for interactive mode
    this.interactive = {
      sids: [],
      targets: {}
    };
    this.schema = schema;
    this.suite = { ...suite };
    this.projectDirectory = projectDirectory;
    this.outputDirectory = outputDirectory;
    this.snippets = { targets: {}, groups: {}, ...snippets };
    this.env = env;
    this.options = options;
    this.runner = runner; // RUNNER_PUPPETRY when embedded

    this.allTargets = Object.values({ ...sharedTargets, ...snippets.targets, ...targets });
    this.targets = this.allTargets.reduce( ( carry, entry ) => {
        carry[ entry.target ] = entry.selector;
        return carry;
      }, {});

  }

  /**
   * Targets to JavaScript string
   * @param {Object} name
   * @returns {String}
   */
  parseTargets() {
    const allTargets = mapSelectors( getActiveTargets( this.allTargets ) );
    return allTargets
      .filter( ({ target, selector }) => Boolean( target ) && Boolean( selector ) )
      .map( target => this.schema.jest.tplQuery( getTargetChain( target, allTargets ) ) )
      .join( "\n" );
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

  getInteractiveModeTpl( command ) {
    if ( INTERACTIVE_ILLEGAL_METHODS.includes( command.method ) ) {
      return ``;
    }
    this.interactive.sids.push( command.id );
    // filter by method
    return `\n      await bs.page.waitForSelector(\`body[data-puppetry-next="${ command.id }`
      + `"]\`, { timeout: ${ INTERATIVE_TIMEOUT } });`
  }

  static getTraceTpl( target, command ) {
    const tplProp =  ( t ) => `"${ t }": async () => ${ renderTarget( t ) }`,
          secTarget = ( command.assert && command.assert.target ) ? ", " + tplProp( command.assert.target ) : ``;

    return `\n      // Tracing... \n` + ( target === "page"
        ? `      await bs.tracePage( "${ command.id }" );`
        : `      await bs.traceTarget( "${ command.id }", { ${ tplProp( target ) + secTarget } });` );
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
      if ( src === "page" && method.startsWith( "debug" ) ) {
        this.options.headless = false;
        this.options.devtools = true;
        this.options.jestTimeout = 1800000;
      }
      if ( src === "page" && method.startsWith( "assertPerfomanceAsset" ) ) {
        this.options.requireInterceptTraffic = true;
      }
      if ( src === "page" && method.startsWith( "assertGaTracking" ) ) {
        this.options.requireInterceptTraffic = true;
      }

      if ( target !== "page" && typeof this.targets[ target ] === "undefined" ) {
       throw new TestGeneratorError( `Action cannot find "${ target }" target.`
          + ` Please check your targets` );
      }
      if ( target !== "page" && assert
        && typeof assert.target !== "undefined" && this.targets[ assert.target ] === "undefined" ) {
       throw new TestGeneratorError( `Action assert on "${ assert.target }" target, but cannot find it.`
          + ` Please check your targets` );
      }

      const traceCode = this.options.trace ? TestGenerator.getTraceTpl( target, command ) : ``,
            interactiveModeCode = this.options.interactiveMode ? this.getInteractiveModeTpl( command ) : ``,
            chunk = this.schema[ src ][ method ].template({
              target,
              assert,
              params,
              targetSeletor: this.targets[ target ],
              method,
              id: command.id,
              testId: command.testId
            }) + traceCode + interactiveModeCode;

      // we need targets to highlight in interactive mode
      if ( target !== "page" ) {
        this.interactive.targets[ command.id ] = [{  target, selector: this.targets[ target ] }];
      }
      // Provide source code with markers
      return this.runner === RUNNER_PUPPETRY
        ? `      ${ COMMAND_ID_COMMENT }${ command.groupId }:${ command.testId }:${ command.id }\n${ chunk }`
        : chunk;
    } catch ( err ) {
      console.warn( "parseCommand error:", err, command );
      log.warn( `Renderer process: TestGenerator.parseCommand: ${ err }` );
      throw new TestGeneratorError( `${ target }.${ method }(): ${ err.message }` );
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
      title: `${test.title} {${test.id}}`,
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
      const targets = this.parseTargets(),
            body = Object.values( this.suite.groups )
              .filter( group => group.disabled !== true )
              .map( this.parseGroup )
              .join( "\n" );

      return this.schema.jest.tplSuite({
        title: this.suite.title,
        targets,
        suite: this.suite,
        runner: this.runner,
        env: this.env,
        options: this.options,
        projectDirectory: this.projectDirectory,
        outputDirectory: this.outputDirectory,
        interactive: this.interactive,
        body
      });
    } catch ( err ) {
      console.warn( "generate error:", err );
      log.warn( `Renderer process: TestGenerator.generate: ${ err }` );
      throw new TestGeneratorError( err.message );
    }
  }
}