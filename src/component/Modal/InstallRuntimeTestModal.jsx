import React from "react";
import PropTypes from "prop-types";
import { notification, Alert, Progress, Modal, Button } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { ipcRenderer, shell } from "electron";
import AbstractComponent from "component/AbstractComponent";
import { E_RUNTIME_TEST_PROGRESS, E_RUNTIME_TEST_MILESTONE,
  E_RUNTIME_TEST_ERROR, E_INSTALL_RUNTIME_TEST } from "constant";
import { lockRuntimeTestPath, removeRuntimeTestPath, getRuntimeTestPath,
  initRuntimeTestPath, getLogPath } from "service/io";

const NPM_MILESTONES = {
  "stage:loadCurrentTree": "loading current tree",
  "stage:loadIdealTree:cloneCurrentTree": "cloning current tree",
  "stage:loadIdealTree:loadShrinkwrap": "loading shrink wrap",
  "stage:loadIdealTree:loadAllDepsIntoIdealTree": "fetching all dependencies",
  "stage:loadIdealTree": "loading ideal tree",
  "stage:generateActionsToTake": "generating actions",
  "action:extract": "extracting",
  "action:finalize": "finalizing",
  "action:refresh-package-json": "refreshing package.json",
  "action:preinstall": "running pre-install",
  "action:build": "building",
  "action:install": "installing",
  "action:postinstall": "running post-install",
  "stage:executeActions": "execution",
  "stage:rollbackFailedOptional": "checking for rollback options",
  "stage:runTopLevelLifecycles": ""
};

notification.config({
  placement: "bottomRight"
});

export class InstallRuntimeTestModal extends AbstractComponent {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired
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


  onClickCancel = ( e ) => {
    const { error, progress } = this.state;
    e.preventDefault();
    if ( progress > 0 && !error ) {
      return;
    }
    this.props.action.updateApp({ installRuntimeTestModal: false });
    notification.open({
      message: "Dependencies not installed",
      description: "You still can manage your test project and export the tests."
        + " The mssing dependencies can be installed anytime later."
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
      this.props.action.updateApp({
        installRuntimeTestModal: false,
        testReportModal: true
      });
    } catch ( e ) {
      this.setState({
        error: e.message
      });
    }
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
        error: args[ 1 ]
      });
      // clean up
      removeRuntimeTestPath();
      this.props.action.updateApp({ readyToRunTests: false });
    });

    ipcRenderer.removeAllListeners( E_RUNTIME_TEST_MILESTONE );
    ipcRenderer.on( E_RUNTIME_TEST_MILESTONE, ( ...args ) => {
      this.setState({
        milestone: args[ 1 ]
      });
    });

  }


  render() {
    const { isVisible } = this.props,
          { milestone, error, progress, isDone, process, downloaded } = this.state,
          progressState = ( isDone ? "success" : "active" ),
          buttons = [];

    if ( progress === 0 || error ) {
      buttons.push( <Button key="back" onClick={this.onClickCancel}>Cancel</Button> );
    }

    if ( error ) {
      buttons.push( <Button key="log" onClick={this.onOpenLog}>Open error log</Button> );
      buttons.push( <Button key="cancel" onClick={this.onReportIssue}>Report issue</Button> );
    }

    buttons.push( <Button
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
          title="Mising NPM Dependencies"
          visible={ isVisible }
          closable={ Boolean( progress === 0 || error ) }
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          className="checkbox-group--vertical"
          footer={ buttons }
        >

          <p>In order to run the test within the application you have to install missing dependencies
          (<a onClick={ this.onExtClick } href="https://pptr.dev" rel="nofollow">Puppeteer</a>
          { " " } and <a onClick={ this.onExtClick } href="https://jestjs.io/" rel="nofollow">Jest</a>)
          </p>
          <If exp={ error }>
            <div data-show="true" className="ant-alert ant-alert-error ant-alert-with-description ant-alert-no-icon">
              <div className="ant-alert-message">Cannot install the depndencies</div>
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
              <Alert message={ milestone in NPM_MILESTONES
                ? `${ NPM_MILESTONES[ milestone ] }...` : milestone } type="success"   />
            </If>
          </div>
        </Modal>
      </ErrorBoundary>
    );
  }
}