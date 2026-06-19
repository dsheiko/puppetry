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
            <a tabIndex={-4} role="button" className="layout-icon" onClick={ this.onMinimize }>
              <Icon type="minus" />
            </a>
            { isMaximized
              ? ( <a tabIndex={-3} role="button" className="layout-icon" onClick={ this.onRestore }>
                <Icon type="shrink" />
              </a> )
              : ( <a tabIndex={-3} role="button" className="layout-icon" onClick={ this.onMaximize }>
                <Icon type="arrows-alt" />
              </a> )
            }
            <a tabIndex={-2} role="button" className="layout-icon layout-icon--close" onClick={ this.onClose }>
              <Icon type="poweroff" />
            </a>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
