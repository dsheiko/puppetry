import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import { Icon, Menu, Dropdown } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractPureComponent from "component/AbstractPureComponent";
import { confirmUnsavedChanges } from "service/smalltalk";
import If from "component/Global/If";
import { truncate } from "service/utils";

const win = remote.getCurrentWindow();

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        Edit project
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        Snippets
      </a>
    </Menu.Item>

    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        Shared Targets
      </a>
    </Menu.Item>
     <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        Template expressions
      </a>
    </Menu.Item>
     <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        GIT
      </a>
    </Menu.Item>
  </Menu>
);

export class Toolbar extends AbstractPureComponent {

  static propTypes = {
    action:  PropTypes.shape({
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired,
      setApp: PropTypes.func.isRequired,
      closeApp: PropTypes.func.isRequired
    }),

    suiteModified: PropTypes.bool.isRequired,
    projectName: PropTypes.string
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
    this.props.action.setApp({
      editProjectModal: true
    });
  }

  render() {
    const { isMaximized } = this.state,
          { projectName } = this.props;

    return (
      <ErrorBoundary>
        <div id="cToolbar" className="toolbar">
          <div>
            <Menu  mode="horizontal">
        <Menu.SubMenu
              key="file"
              id="cMainMenuFile"
              title={<span><Icon type="file" /><span>File</span></span>}
            >
          <Menu.Item key="mail1">
            File
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="mail2">
          Settings
        </Menu.Item>
        <Menu.Item key="mail3">
          Run
        </Menu.Item>
  </Menu>
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
            <a tabIndex={-1} role="button" className="layout-icon" href="https://docs.puppetry.app"
              onClick={ this.onExtClick }>
              <Icon type="question-circle" />
            </a>
            <a tabIndex={-3} role="button" className="layout-icon" onClick={this.onClose}>
              <Icon type="poweroff" />
            </a>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
