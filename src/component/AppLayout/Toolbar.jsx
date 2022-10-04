import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import { Icon, Menu, Dropdown } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractPureComponent from "component/AbstractPureComponent";
import { confirmUnsavedChanges } from "service/smalltalk";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const win = remote.getCurrentWindow();

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        projectName: state.project.name,
        suiteModified: state.suite.modified 
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
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
          
    window.consoleCount( __filename );

    return (
      <ErrorBoundary>
        <div id="cToolbar" className="toolbar">

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

      </ErrorBoundary>
    );
  }
}
