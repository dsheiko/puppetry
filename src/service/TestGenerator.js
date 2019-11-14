import log from "electron-log";
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
    // resolve css prop
    this.normalizedTargets = mapSelectors( getActiveTargets( this.allTargets ) )
      //.filter( entry => !entry.ref )
      .reduce( ( carry, entry ) => {
        carry[ entry.target ] = entry;
        return carry;
      }, {});

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
    return Object.values( this.normalizedTargets )
      .filter( ({ target, selector }) => Boolean( target ) && Boolean( selector ) )
      .map( target => this.schema.jest.tplQuery( getTargetChain( target, this.normalizedTargets ) ) )
      .join( "\n" );
  }

  /**
   * @param {string} ref
   * @param {object} variables
   * @param {string} parentId
   * @returns {string}
   */
  parseRef = ( ref, variables, parentId ) => {
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
            .map( command => Object.assign({}, command, { parentId }) )
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
      + `"]\`, { timeout: ${ INTERATIVE_TIMEOUT } });`;
  }

  static getTraceTpl( target, command ) {
    const tplProp =  ( t ) => `"${ t }": async () => ${ renderTarget( t ) }`,
          secTarget = ( command.assert && command.assert.target ) ? ", " + tplProp( command.assert.target ) : ``;

    return `\n      // Tracing... \n` + ( target === "page"
      ? `      await bs.tracePage( "${ command.id }" );`
      : `      await bs.traceTarget( "${ command.id }", { ${ tplProp( target ) + secTarget } });` );
  }

  renderWaitForTarget( target ) {
    const match = this.normalizedTargets[ target ];
    if ( !match )  {
      return "";
    }
    return `      // Wait for CSS selector/Xpath to appear in page`
    + match.css
      ? `      await bs.page.waitForSelector( ${ JSON.stringify( match.selector ) } );\n`
      : `      bs.page.waitForXPath( ${ JSON.stringify( match.selector ) } )\n`;
  }

  /**
   * @param {Object} command
   * @returns {string}
   */
  parseCommand = ( command ) => {
    const { isRef, ref, target, method, params, assert, variables, disabled, id } = command,
          src = target === "page" ? "page" : "element";
    if ( disabled ) {
      return ``;
    }
    if ( isRef ) {
      return this.parseRef( ref, variables, id );
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
      if ( src === "page" && method.startsWith( "assertPerformanceAsset" ) ) {
        this.options.requireInterceptTraffic = true;
      }
      if ( src === "page" && method.startsWith( "assertGaTracking" ) ) {
        this.options.requireInterceptTraffic = true;
      }
      if ( src === "page" && ( method.startsWith( "waitForRequest" ) || method.startsWith( "waitForResponse" ) ) ) {
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
            targetObj = ( target !== "page" && target in this.normalizedTargets )
              ? this.normalizedTargets[ target ] : null,
            waitForTarget = ( src !== "page" && command.waitForTarget === true )
              ? this.renderWaitForTarget( target ) : ``,
            chunk = waitForTarget + this.schema[ src ][ method ].template({
              target,
              assert,
              params,
              targetSeletor: this.targets[ target ],
              targetObj,
              method,
              id: command.id,
              testId: command.testId,
              parentId: command.parentId
            }) + traceCode + interactiveModeCode;


      // we need targets to highlight in interactive mode
      if ( target !== "page" ) {
        this.interactive.targets[ command.id ] = [{  target, selector: this.targets[ target ] }];
      }
      // Provide source code with markers
      const code = this.runner === RUNNER_PUPPETRY
        ? `      ${ COMMAND_ID_COMMENT }${ command.groupId }:${ command.testId }:${ command.id }\n${ chunk }`
        : chunk;

      return this.wrapCommandBody( ( typeof command.comment === "string" && command.comment.startsWith( "@assert " ) )
        ? this.renderCommandTryCath( code, command.comment ) : code, target, method );

    } catch ( err ) {
      console.warn( "parseCommand error:", err, command );
      log.warn( `Renderer process: TestGenerator.parseCommand: ${ err }` );
      throw new TestGeneratorError( `${ target }.${ method }(): ${ err.message }` );
    }
  }

  wrapCommandBody( body, target, method ) {
    return this.options.allure ? `      util.startStep( ${ JSON.stringify( `${ target }.${ method }` ) } );\n`
      + body + `\n      util.endStep();\n` : body;
  }

  /**
   * To generate self-tests
   */
  renderCommandTryCath( code, comment ) {
    const substr = comment.substr( 8 ).trim();
    return `\n      try { ${ code }\n      } catch( err ){\n      `
      + `  expect( err.message ).toMatch( ${ JSON.stringify( substr ) } );\n      }`;
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