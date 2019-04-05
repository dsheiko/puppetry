import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer, shell } from "electron";
import { E_RUN_TESTS } from "constant";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { exportProject, getRuntimeTestPath } from "service/io";
import { millisecondsToStr } from "service/utils";
import { Icon, Spin, Button, Collapse } from "antd";
import { join } from "path";
import { TestGeneratorError } from "error";
import Convert from "ansi-to-html";

const Panel = Collapse.Panel,
      convert = new Convert();

let counter = 0;


export class TestReport extends AbstractComponent {

  static propTypes = {
    projectDirectory: PropTypes.string.isRequired,
    checkedList: PropTypes.arrayOf( PropTypes.string ).isRequired,
    targets: PropTypes.any,
    action: PropTypes.shape({
      setError: PropTypes.func.isRequired,
      removeAppTab: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired
    })
  }

  state = {
    report: {},
    stdErr: "",
    loading: true,
    ok: false
  }

  onOpenDirectory = () => {
    shell.openItem( join( this.runtimeTemp, "screenshots" ) );
  }

  run = async () => {
    this.props.action.saveSuite();
    try {
      this.runtimeTemp = getRuntimeTestPath();
      this.setState({ loading: true });
      const specList = await exportProject(
              this.props.projectDirectory,
              this.runtimeTemp,
              this.props.checkedList,
              this.props.headless,
              this.props.launcherArgs
            ),
            res = ipcRenderer.sendSync( E_RUN_TESTS, this.runtimeTemp, specList );

      this.setState({
        loading: false,
        report: res.report.results,
        stdErr: res.stdErr,
        ok: true
      });
    } catch ( err ) {
      const message = err instanceof TestGeneratorError ? "Test parser error" : "Cannot run tests";
      this.props.action.setError({
        visible: true,
        message,
        description: err.message
      });
    }

  }

  componentDidMount() {
    // Give time to close the modal
    setTimeout( () => this.run(), 200 );
  }

  /**
   * For most expected messages like target not found let's beautify the output
   * @param {String[]} msg
   * @returns {String}
   */
  static normalizeFailureMessages( msg ) {
    if ( !msg || !msg.length ) {
      return "";
    }
    const [ text ] = msg,
          pureText = TestReport.removeAnsiColors( text ),
          [ ex ] = text.split( "\n" );
    return ex.length > 10 ? ex : pureText;
  }

  /*eslint no-control-regex: 0*/

  static removeAnsiColors( msg ) {
    const re = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
    return msg.replace( re, "" );
  }

  static getDetails( testResults ) {
    return testResults.reduce( ( payload, entry ) => {
      const carry = entry.testResults.reduce( ( carry, test ) => {
        const [ suite, describe ] = test.ancestorTitles;
        carry[ suite ] = suite in carry ? carry[ suite ] : {};
        carry[ suite ][ describe ] = describe in carry[ suite ] ? carry[ suite ][ describe ] : [];
        carry[ suite ][ describe ].push({
          duration: test.duration,
          failureMessages: TestReport.normalizeFailureMessages( test.failureMessages ),
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
    const { report, loading, ok, stdErr } = this.state;

    if ( report !== {} && !report ) {
      this.props.action.setError({
        visible: true,
        message: "Cannot export project",
        description: "Jest testing framework could not run the tests"
      });
    }

    const details = "testResults" in report ? TestReport.getDetails( report.testResults ) : {};

    return ( <ErrorBoundary>
      <If exp={ loading }>
        <Spin spinning={ loading } tip="Tests are running.."><br /><br /><br /><br /><br /></Spin>
      </If>

      <If exp={ ok && !loading }>
        <div id="cTestReport">

          <p>
            <Button
              onClick={ this.onOpenDirectory }
              type="primary"
              icon="folder-open">Open directory with generated screenshots</Button>
          </p>

          <div>{ report.success
            ? ( <div className="tr-badge is-ok">PASSED</div> )
            : ( <div className="tr-badge is-fail">FAILED</div> ) }</div>


          { ( stdErr && !report.success ) && <Collapse>
            <Panel header="Error details" key="1">
              <p dangerouslySetInnerHTML={{ __html: convert.toHtml( stdErr ) }}></p>
            </Panel>
          </Collapse> }

          <div className="bottom-line">
            { Object.keys( details ).map( suiteKey => ( <div key={ `k${ counter++ }` } className="test-report__suite">
              { suiteKey }
              {  Object.keys( details[ suiteKey ]).map( describeKey => ( <div
                key={ `k${ counter++ }` }
                className="test-report__describe">
                { describeKey }
                { details[ suiteKey ][ describeKey ].map( spec => ( <div
                  key={ `k${ counter++ }` }
                  className="test-report__it">
                  <If exp={ spec.status === "passed" }>
                    <Icon
                      className="test-report__ok"
                      type="check" theme="outlined" fill="#52c41a" width="16" height="16" />
                  </If>
                  <If exp={ spec.status !== "passed" }>
                    <Icon
                      className="test-report__fail"
                      type="close" theme="outlined" fill="#eb2f96" width="16" height="16" />
                  </If>
                  { " " }<span className="test-report__it__title">{ spec.title }
                    { " " }({ millisecondsToStr( spec.duration ) })
                  </span>

                  <If exp={ spec.status !== "passed" && spec.failureMessages }>
                    <div  className="test-report__it__exception">{ spec.failureMessages }</div>
                  </If>


                </div> ) ) }
              </div> ) ) }
            </div> ) ) }
          </div>


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
