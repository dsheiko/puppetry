/*eslint no-useless-escape: 0*/
import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer, shell } from "electron";
import { RUNNER_PUPPETRY, E_RUN_TESTS, SNIPPETS_GROUP_ID, DIR_SCREENSHOTS } from "constant";
import LoadingTip from "component/Global/LoadingTip";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { exportProject, getRuntimeTestPath, parseReportedFailures } from "service/io";
import { millisecondsToStr } from "service/utils";
import { Spin, Collapse, notification } from "antd";
import { join } from "path";
import { TestGeneratorError } from "error";
import Convert from "ansi-to-html";
import { getSelectedVariables, getActiveEnvironment } from "selector/selectors";
import { ReportBody } from "./TestReport/ReportBody";
import path from "path";


const Panel = Collapse.Panel,
      convert = new Convert();


export class TestReport extends AbstractComponent {

  static propTypes = {
    projectDirectory: PropTypes.string.isRequired,
    checkedList: PropTypes.arrayOf( PropTypes.string ).isRequired,
    targets: PropTypes.any,
    selector: PropTypes.any,
    action: PropTypes.shape({
      setError: PropTypes.func.isRequired,
      removeAppTab: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      updateCommand: PropTypes.func.isRequired,
      resetCommandFailures: PropTypes.func.isRequired
    })
  }

  state = {
    report: {},
    details: {},
    stdErr: "",
    loading: true,
    ok: false
  }

  onOpenDirectory = () => {
    shell.openItem( join( this.props.projectDirectory, DIR_SCREENSHOTS ) );
    notification.open({
      message: "Opening system file manager",
      description: "The requested directory will open in the default file manager in a few seconds"
    });
  }

  run = async () => {
    const { project,
            environment,
            passSuiteOptions,
            passExportOptions,
            passProjectOptions } = this.props,
          // options from Report modal like interactiveMode, updateSnapshot
          options = this.props.options || {};
    this.props.action.saveSuite();
    this.props.action.resetCommandFailures();
    try {
      // contains file:line:col from error report
      this.reportedFailures = [];
      this.runtimeTemp = getRuntimeTestPath();
      this.setState({ loading: true });
      const activeEnv = getActiveEnvironment( project.environments, environment ),
            specList = await exportProject({
              projectDirectory: this.props.projectDirectory,
              outputDirectory: this.runtimeTemp,
              suiteFiles: this.props.checkedList,
              runner: RUNNER_PUPPETRY,
              snippets: this.props.snippets,
              sharedTargets: project.targets,
              env: {
                  variables: getSelectedVariables( project.variables, activeEnv ),
                  environment
              },
              projectOptions: passProjectOptions,
              suiteOptions:  passSuiteOptions,
              exportOptions: passExportOptions
            }),
            res = ipcRenderer.sendSync( E_RUN_TESTS, this.runtimeTemp, specList );

      this.setState({
        loading: false,
        report: res.report.results,
        details: "testResults" in res.report.results ? this.getDetails( res.report.results.testResults ) : {},
        stdErr: res.stdErr,
        ok: true
      });

      this.highlightErrorsInSuite();

    } catch ( err ) {
      console.error( err );
      const message = err instanceof TestGeneratorError ? "Test parser error" : "Cannot run tests";
      this.props.action.setError({
        visible: true,
        message,
        description: err.message
      });
    }

  }

  async highlightErrorsInSuite() {
    try {
      const commands = await parseReportedFailures( this.reportedFailures );
      commands.forEach( ({ id, groupId, testId, failure }) => {
        if ( groupId === SNIPPETS_GROUP_ID ) {
          return this.props.action.updateCommandByRef( testId, failure );
        }
        this.props.action.updateCommand({
          id, groupId, testId, failure
        });
      });
    } catch ( err ) {
      console.error( err );
    }
  }

  componentDidMount() {
    // Give time to close the modal
    setTimeout( () => this.run(), 400 );
  }

  /**
   * For most expected messages like target not found let's beautify the output
   * @param {String[]} msg
   * @returns {String}
   */
  normalizeFailureMessages( msg ) {
    if ( !msg || !msg.length ) {
      return "";
    }
    const [ text ] = msg,
          [ ex, filePos ] = text.split( "\n" ),
          errMessage = TestReport.removeAnsiColors( ex.length > 10 ? ex : text );

    filePos && this.parseReportFailureLocationLine( filePos.trim(), errMessage.substr( 0, 80 ) );
    return errMessage;
  }

  /**-
   * Parse report lines like:
   *  "at Object.somecrpa (/tmp/.runtime-test/specs/react-html5-form-valid.spec.js:46:7)"
   * @param String filePos
   * @param String message
   */
  parseReportFailureLocationLine( filePos, message ) {
    const re = /\((.*):(\d+):(\d+)\)$/,
          match = filePos.match( re );
    if ( !match ) {
      return;
    }
    const file = match[ 1 ],
          line = match[ 2 ];
    if ( !( file in this.reportedFailures ) ) {
      this.reportedFailures[ file ] = [];
    }
    this.reportedFailures[ file ].push({
      line,
      message
    });
  }

  /*eslint no-control-regex: 0*/

  static removeAnsiColors( msg ) {
    const re = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
    return msg.replace( re, "" );
  }

  getDetails( testResults ) {
    // report.results.testResults
    return testResults.reduce( ( payload, entry ) => {
      // testResultItem: { console, failureMessage, leaks, numFailingTests, numPassingTests, numPendingTests,
      //  perfStats, skipped, snapshot, sourceMaps, testFilePath, testResults }
      const carry = entry.testResults.reduce( ( carry, test ) => {
        // test: { ancestorTitles, duration, failureMessages, fullName, location, numPassingAsserts, status, title }
        const [ suite, describe ] = test.ancestorTitles,
              suiteId = `${ suite } (${ path.parse( entry.testFilePath ).base })`;

        carry[ suiteId ] = suiteId in carry ? carry[ suiteId ] : {};
        carry[ suiteId ][ describe ] = describe in carry[ suiteId ] ? carry[ suiteId ][ describe ] : [];
        carry[ suiteId ][ describe ].push({
          suite,
          duration: test.duration,
          failureMessages: this.normalizeFailureMessages( test.failureMessages ),
          location: test.location,
          numPassingAsserts: test.numPassingAsserts,
          status: test.status, // "passed"
          title: test.title
        });
        return carry;
      }, {});
      return { ...payload, ...carry };
    }, {});
  }


  render() {
    const { report, loading, ok, stdErr, details } = this.state,
          printableStdErr = convert.toHtml( stdErr )
            .replace( /\n/mg, "" )
            .replace( /<br\s*\/>+/mg, "\n" )
            .replace( /\s[AD]\s/mg, "" )
            .replace( /\n+/mg, "<br />" )
            .replace( /color\:#FFF/mg, "color:rgba(0,0,0,0.65)" );


    if ( report !== {} && !report ) {
      this.props.action.setError({
        visible: true,
        message: "Cannot export project",
        description: "Jest testing framework could not run the tests"
      });
    }
    return ( <ErrorBoundary>
      <If exp={ loading }>
        <div className="test-report-spin">
          <Spin spinning={ loading } tip="Tests are running.."></Spin>
          <LoadingTip />
        </div>
      </If>

      <If exp={ ok && !loading }>
        <div id="cTestReport">

          <div>{ report.success
            ? ( <div className="tr-badge is-ok">PASSED</div> )
            : ( <div className="tr-badge is-fail">FAILED</div> ) }</div>


          { ( stdErr && !report.success ) && <Collapse>
            <Panel header="Error details" key="1">
              <p dangerouslySetInnerHTML={{ __html: printableStdErr }}></p>
            </Panel>
          </Collapse> }


          <ReportBody details={ details }
            projectDirectory={ this.props.projectDirectory }
            selector={ this.props.selector }
            action={ this.props.action } />


          <dl className="tr-row">
            <dt>Test Suites</dt>
            <dd>{ report.numPassedTestSuites } passed</dd>
            <dd>{ report.numTotalTestSuites } total</dd>
          </dl>
          <dl className="tr-row">
            <dt>Tests</dt>
            <dd>{ report.numPassedTests } passed</dd>
            <dd>{ report.numTotalTests } total</dd>
          </dl>
          <dl className="tr-row">
            <dt>Times</dt>
            <dd>{
              millisecondsToStr( Date.now() - parseInt( report.startTime, 10 ) )
            }</dd>
          </dl>


        </div>

      </If>
    </ErrorBoundary> );
  }
}
