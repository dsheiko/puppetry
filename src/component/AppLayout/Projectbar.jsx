import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import { Icon, Menu } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractPureComponent from "component/AbstractPureComponent";
import { confirmUnsavedChanges } from "service/smalltalk";
import If from "component/Global/If";
import { truncate } from "service/utils";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        projectName: state.project.name
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class Projectbar extends AbstractPureComponent {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired
    }),
    projectName: PropTypes.string
  }

  onEditProject = () => {
    this.props.action.setApp({
      editProjectModal: true
    });
  }

  openTab = async ( tabKey ) => {
    this.props.action.addAppTab( tabKey );
  }

  render() {
    const { projectName } = this.props;
    if ( !projectName ) {
      return null;
    }
    return (
      <ErrorBoundary>
        <div className="layout-project">

          <div>
            <Icon type="project" />{ " " }
            <span id="cToolbarProjectName">{ truncate( projectName, 80 ) }</span>
          </div>

          <Menu id="cProjectMenu"
            forceSubMenuRender={ true }
            mode="horizontal"
            selectable={ false }>

            <Menu.Item key="100" onClick={ this.onEditProject } id="cMainMenuProjectSettings">
                Settings
            </Menu.Item>


            <Menu.Item key="104"
              onClick={ () => this.openTab( "projectTargets" ) } id="cMainMenuProjectTargets">
                Shared targets
            </Menu.Item>

            <Menu.Item key="102"
              onClick={ () => this.openTab( "projectVariables" ) } id="cMainMenuProjectVariables">
                Template variables
            </Menu.Item>

          </Menu>


        </div>
      </ErrorBoundary>
    );
  }
}
