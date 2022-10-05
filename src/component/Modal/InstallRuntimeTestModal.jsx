import React from "react";
import PropTypes from "prop-types";
import { notification, Alert, Progress, Modal, Button } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { ipcRenderer, shell } from "electron";
import AbstractComponent from "component/AbstractComponent";
import * as classes from "./classes";
import { E_RUNTIME_TEST_PROGRESS, E_RUNTIME_TEST_MILESTONE,
  E_RUNTIME_TEST_ERROR, E_INSTALL_RUNTIME_TEST, MODAL_DEFAULT_PROPS } from "constant";
import { lockRuntimeTestPath, removeRuntimeTestPath, getRuntimeTestPath,
  initRuntimeTestPath, getLogPath, getRuntimeTestPathSafe } from "service/io";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

notification.config({
  placement: "bottomRight"
});

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.installRuntimeTestModal
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class InstallRuntimeTestModal extends AbstractComponent {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired
    }),
    isVisible: PropTypes.bool.isRequired
  }

  state = {
    milestone: "",
    downloaded: 0,
    process: "",
    error: "",
    progress: 0,
    isDone: false
  }

  resetState() {
    this.setState({
      milestone: "",
      downloaded: 0,
      process: "",
      error: "",
      progress: 0,
      isDone: false
    });
  }


  onClickCancel = ( e ) => {
    const { error, progress } = this.state;
    e.preventDefault();
    this.resetState();
    if ( progress > 0 && !error ) {
      return;
    }
    this.props.action.setApp({ installRuntimeTestModal: false });
    notification.open({
      message: "Dependencies not installed",
      description: "You still can manage your test project and export the tests."
        + " The missing dependencies can be installed anytime later."
    });
  }

  onClickInstall = async ( e ) => {
    e.preventDefault();
    initRuntimeTestPath();
    ipcRenderer.send( E_INSTALL_RUNTIME_TEST, getRuntimeTestPath() );

  }

  onComplete = () => {
    try {
      lockRuntimeTestPath();
      this.props.action.setApp({
        readyToRunTests: true,
        installRuntimeTestModal: false,
        testReportModal: true
      });
      this.resetState();
    } catch ( e ) {
      this.setState({
        error: e.message
      });
    }
  }

  onOpenAppDataDirectory = () => {
    shell.openItem( getRuntimeTestPathSafe() );
  }

  onOpenLog = () => {
    shell.openItem( getLogPath() );
  }

  onReportIssue = ( e ) => {
    e.preventDefault();
    shell.openExternal( "https://github.com/dsheiko/puppetry/issues" );
  }

  componentDidMount() {

    ipcRenderer.removeAllListeners( E_RUNTIME_TEST_PROGRESS );
    ipcRenderer.on( E_RUNTIME_TEST_PROGRESS, ( ...args ) => {
      const payload = args[ 1 ];
      this.setState({
        progress: payload.progress,
        process: payload.process,
        isDone: payload.isDone,
        downloaded: payload.downloaded
      });
      if ( payload.isDone ) {
        this.onComplete();
      }
    });

    ipcRenderer.removeAllListeners( E_RUNTIME_TEST_ERROR );
    ipcRenderer.on( E_RUNTIME_TEST_ERROR, ( ...args ) => {
      this.setState({
        error: args[ 1 ],
        milestone: "",
        downloaded: 0,
        process: "",
        progress: 0,
        isDone: false
      });
      // clean up
      removeRuntimeTestPath();
      this.props.action.setApp({ readyToRunTests: false });
    });

    ipcRenderer.removeAllListeners( E_RUNTIME_TEST_MILESTONE );
    ipcRenderer.on( E_RUNTIME_TEST_MILESTONE, ( ...args ) => {
      this.setState({
        milestone: args[ 1 ]
      });
    });

  }

  // Do not update until visible
  shouldComponentUpdate( nextProps ) {
    if ( this.props.isVisible !== nextProps.isVisible ) {
      return true;
    }
    if ( !nextProps.isVisible ) {
      return false;
    }
    return true;
  }


  render() {
    const { isVisible } = this.props,
          { milestone, error, progress, isDone, process, downloaded } = this.state,
          progressState = ( isDone ? "success" : "active" ),
          buttons = [];

    if ( progress === 0 || error ) {
      buttons.push( <Button
        key="back"
        className={ classes.BTN_CANCEL }
        onClick={this.onClickCancel}>Cancel</Button> );
    }

    if ( error ) {
      buttons.push( <Button
        key="log"
        className={ classes.BTN_LOG }
        onClick={this.onOpenLog}>Open error log</Button> );
      buttons.push( <Button
        key="cancel"
        className={ classes.BTN_CANCEL }
        onClick={this.onReportIssue}>Report issue</Button> );
    }

    buttons.push( <Button
      className={ classes.BTN_OK }
      key="submit"
      type="primary"
      autoFocus={ true }
      disabled={ progress > 0 && !error }
      onClick={this.onClickInstall}>
              Install
    </Button> );

    return (
      <ErrorBoundary>
        <Modal
          title="Missing NPM Dependencies"
          visible={ isVisible }
          closable={ Boolean( progress === 0 || error ) }
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          className="checkbox-group--vertical"
          { ...MODAL_DEFAULT_PROPS }
          footer={ buttons }
        >

          <p>In order to run the test within the application you need to install missing dependencies
          (<a onClick={ this.onExtClick } href="https://pptr.dev" rel="nofollow">Puppeteer</a>
          { " " } and <a onClick={ this.onExtClick } href="https://jestjs.io/" rel="nofollow">Jest</a>)
          </p>
          <p>
          We use { " " }<a onClick={ this.onExtClick } href="https://www.npmjs.com" rel="nofollow">
          Node package manager</a>{ " " }
          to fetch, validate and install dependencies. It’s reliable and considerably fast.
          Yet the mentioned bundles consist of more than 400 separate packages and take in total ~350MB.
          So the installation time depends on your network conditions, may take a few minutes.
          The packages will be delivered in { " " }
            <a onClick={ this.onOpenAppDataDirectory } href="#app">app data directory</a>
          </p>
          <If exp={ error }>
            <div data-show="true" className="ant-alert ant-alert-error ant-alert-with-description ant-alert-no-icon">
              <div className="ant-alert-message">Cannot install the dependencies</div>
              <div className="ant-alert-description">
              Unfortunately the application failed to install the required dependencies by
              using NPM programmatically.
              What you can do is to install the missing dependencies manually. Just follow the steps:
                <ul>
                  <li>Install npm tool
                  (<a onClick={ this.onExtClick } href="https://www.npmjs.com/get-npm">see here how to</a>)</li>
                  <li>Navigate to <code>{ getRuntimeTestPath() }</code> and run there npm install</li>
                  <li>Restart Puppetry application</li>
                </ul>
              </div>
            </div>
          </If>

          <div className={ downloaded ? "npm-install with-bytes" : "npm-install" }>
            <If exp={ progress > 0 }>
              <h4>{ process }...</h4>
              <Progress
                percent={ progress }
                format={ percent => {
                  return downloaded ? downloaded : `${ percent }%`;
                }}
                status={ error ? "exception" : progressState } />

            </If>
            <If exp={ milestone && !error && !isDone }>
              <Alert style={{ height: 56, overflow: "hidden" }} message={ milestone } type="success"   />
            </If>
          </div>
        </Modal>
      </ErrorBoundary>
    );
  }
}