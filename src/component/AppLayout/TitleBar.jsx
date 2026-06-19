import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import { Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractPureComponent from "component/AbstractPureComponent";
import { confirmUnsavedChanges } from "service/smalltalk";
import { truncate } from "service/utils";
import { MainMenu } from "./Sider/MainMenu";
import If from "component/Global/If";

const win = remote.getCurrentWindow();

export class TitleBar extends AbstractPureComponent {

  static propTypes = {
    action: PropTypes.shape({
      saveSuite:              PropTypes.func.isRequired,
      setSuite:               PropTypes.func.isRequired,
      setApp:                 PropTypes.func.isRequired,
      closeApp:               PropTypes.func.isRequired,
      removeAppTab:           PropTypes.func.isRequired,
      addAppTab:              PropTypes.func.isRequired,
      openSuiteFile:          PropTypes.func.isRequired,
      autosaveProject:        PropTypes.func.isRequired
    }),
    projectName:      PropTypes.string,
    suiteModified:    PropTypes.bool.isRequired,
    isProjectEmpty:   PropTypes.bool.isRequired,
    isSuiteOpen:      PropTypes.bool.isRequired,
    isProjectOpen:    PropTypes.bool.isRequired,
    readyToRunTests:  PropTypes.bool.isRequired
  }

  state = {
    isMaximized: win.isMaximized()
  };

  UNSAFE_componentWillMount() {
    win.on( "maximize", this.updateState );
    win.on( "unmaximize", this.updateState );
  }

  updateState = () => {
    this.setState({ isMaximized: win.isMaximized() });
  }

  onMinimize = () => {
    win.minimize();
  }

  onRestore = () => {
    win.restore();
  }

  onMaximize = () => {
    win.maximize();
  }

  onClose = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite:  this.props.action.setSuite
      });
    }
    this.props.action.closeApp();
  }

  onEditProject = () => {
    this.props.action.setApp({ editProjectModal: true });
  }

  render() {
    const { isMaximized } = this.state,
          { projectName, suiteModified, action,
            isProjectEmpty, isSuiteOpen, isProjectOpen, readyToRunTests } = this.props;

    return (
      <ErrorBoundary>
        <div id="cTitleBar" className="vsc-titlebar">
          <img
            src="./assets/puppetry.svg"
            alt="Puppetry"
            className="vsc-titlebar__logo"
          />

          <MainMenu
            action={ action }
            isProjectEmpty={ isProjectEmpty }
            isSuiteOpen={ isSuiteOpen }
            isProjectOpen={ isProjectOpen }
            suiteModified={ !!suiteModified }
            readyToRunTests={ !!readyToRunTests }
          />

          <span className="vsc-titlebar__spacer" />

          <If exp={ projectName }>
            <span className="vsc-titlebar__project">
              <Icon type="project" />{ " " }
              { truncate( projectName, 60 ) }
              { " " }
              <a
                tabIndex={-3}
                role="button"
                className="vsc-titlebar__project-edit"
                title="Edit project name"
                onClick={ this.onEditProject }
              >
                <Icon type="tool" />
              </a>
            </span>
          </If>

          <div className="vsc-titlebar__controls">
            <a tabIndex={-4} role="button" className="layout-icon layout-icon--minimize" title="Minimize" onClick={ this.onMinimize }>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="1" viewBox="0 0 10 1">
                <rect width="10" height="1" fill="currentColor" />
              </svg>
            </a>
            { isMaximized
              ? ( <a tabIndex={-3} role="button" className="layout-icon" title="Restore" onClick={ this.onRestore }>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 10 10">
                  <path fill="currentColor" d="M2 0v2H0v8h8V8h2V0H2zm1 1h6v6H8V2H3V1zM1 3h6v6H1V3z" />
                </svg>
              </a> )
              : ( <a tabIndex={-3} role="button" className="layout-icon" title="Maximize" onClick={ this.onMaximize }>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 10 10">
                  <path fill="currentColor" d="M0 0v10h10V0H0zm9 9H1V1h8v8z" />
                </svg>
              </a> )
            }
            <a tabIndex={-2} role="button" className="layout-icon layout-icon--close" title="Close" onClick={ this.onClose }>
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 10 10">
                <path fill="currentColor" d="M6.279 5l3.607-3.607-.707-.707L5.572 4.293 1.965.686l-.707.707L4.865 5 1.258 8.607l.707.707L5.572 5.707l3.607 3.607.707-.707z" />
              </svg>
            </a>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
