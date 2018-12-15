import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Modal, Menu, Alert } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { confirmUnsavedChanges } from "service/smalltalk";


export class OpenSuiteModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired,
      openSuiteFile: PropTypes.func.isRequired
    }),
    files: PropTypes.arrayOf( PropTypes.string ).isRequired,
    isVisible: PropTypes.bool.isRequired,
    projectDirectory: PropTypes.string
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ openSuiteModal: false });
  }

  onClick = async ( file ) => {
    const { openSuiteFile } = this.props.action;

    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }

    openSuiteFile( file );
    this.props.action.updateApp({ openSuiteModal: false });
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
