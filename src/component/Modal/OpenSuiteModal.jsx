import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Modal, Menu, Alert } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { confirmUnsavedChanges } from "service/smalltalk";
import { MODAL_DEFAULT_PROPS } from "constant";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.openSuiteModal,
        projectDirectory: state.settings.projectDirectory,
        suiteModified: state.suite.modified,
        files: state.app.project.files,
        active: state.suite.filename,
        isVisible: state.app.openSuiteModal
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )

export class OpenSuiteModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      openSuiteFile: PropTypes.func.isRequired
    }),
    files: PropTypes.arrayOf( PropTypes.string ).isRequired,
    isVisible: PropTypes.bool.isRequired,
    projectDirectory: PropTypes.string
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ openSuiteModal: false });
  }

  onClick = async ( file ) => {
    const { openSuiteFile, autosaveProject } = this.props.action;

    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }

    openSuiteFile( file );
    autosaveProject();
    this.props.action.setApp({ openSuiteModal: false });
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
    const { isVisible, files } = this.props;

    return (
      <ErrorBoundary>
        <Modal
          title="Open Suite"
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          { ...MODAL_DEFAULT_PROPS }
          footer={ null }
        >

          <div className="modal-file-navigator">
            <If exp={ files.length }>
              <Menu>
                { files.map( ( file, inx ) => (
                  <Menu.Item
                    onClick={ () => this.onClick( file ) }
                    key={ inx }>{ file }</Menu.Item>
                ) )}
              </Menu>
            </If>
            <If exp={ !files.length }>
              <Alert message="Project is empty" type="warning" />
            </If>
          </div>
        </Modal>
      </ErrorBoundary>
    );
  }
}
