import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import { Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { confirmUnsavedChanges } from "service/smalltalk";
import If from "component/Global/If";
import { truncate } from "service/utils";

const win = remote.getCurrentWindow();

export class Toolbar extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired,
      updateApp: PropTypes.func.isRequired,
      closeApp: PropTypes.func.isRequired
    }),

    suiteModified: PropTypes.bool.isRequired,

    project:  PropTypes.shape({
      modified: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired
    })
  }

  state = {
    isMaximized: win.isMaximized()
  };

  UNSAFE_componentWillMount() {
    win.on( "maximize", this.updateState );
    win.on( "unmaximize", this.updateState );
  }

  updateState = () => {
    this.setState({
      isMaximized: win.isMaximized()
    });
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
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.closeApp();
  }

  onEditProject = () => {
    this.props.action.updateApp({
      editProjectModal: true
    });
  }

  render() {
    const { isMaximized } = this.state,
          { project } = this.props;

    return (
      <ErrorBoundary>
        <div id="cToolbar" className="toolbar">
          <div>
            <If exp={ project.name }>
              <Icon type="project" />{ " " }
              Project: { " " }<span id="cToolbarProjectName">{ truncate( project.name, 80 ) }</span>
              { " " }<a tabIndex={-3} role="button" onClick={ this.onEditProject }><Icon type="tool" /></a>
            </If>
          </div>
          <div>
            { isMaximized
              ? ( <a tabIndex={-2} role="button" className="layout-icon" onClick={this.onRestore}>
                <Icon type="shrink" />
              </a> )
              : ( <a tabIndex={-2} role="button" className="layout-icon" onClick={this.onMaximize}>
                <Icon type="arrows-alt" />
              </a> )
            }

            <a tabIndex={-3} role="button" className="layout-icon" onClick={this.onClose}>
              <Icon type="poweroff" />
            </a>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
