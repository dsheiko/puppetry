import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from "electron";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button } from "antd";
import BrowseDirectory from "component/Global/BrowseDirectory";
import ErrorBoundary from "component/ErrorBoundary";
import { isProject } from "service/io";
import { E_WATCH_FILE_NAVIGATOR, A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS } from "constant";

const connectForm = Form.create();

@connectForm
export class OpenProjectModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired
    }),

    isVisible: PropTypes.bool.isRequired,
    projectDirectory: PropTypes.string.isRequired
  }

  state = {
    locked: false,
    browseDirectoryValidateStatus: "",
    browseDirectoryValidateMessage: "",
    selectedDirectory: ""
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ openProjectModal: false });
  }

  onClickOk = async ( e ) => {
    const { updateApp, loadProject, loadProjectFiles, saveSettings } = this.props.action,
          projectDirectory = this.state.selectedDirectory || this.props.projectDirectory;

    e.preventDefault();
    if ( !this.isBrowseDirectoryValid() ) {
      return;
    }
    saveSettings({ projectDirectory });
    updateApp({ openProjectModal: false });
    await loadProject();
    await loadProjectFiles();
    ipcRenderer.send( E_WATCH_FILE_NAVIGATOR, projectDirectory );
  }

  isBrowseDirectoryValid() {
    if ( !this.state.selectedDirectory ) {
      this.setState({ locked: true,  browseDirectoryValidateStatus: A_FORM_ITEM_ERROR });
      return false;
    }

    if ( !isProject( this.state.selectedDirectory ) ) {
      this.setState({ locked: true,
        browseDirectoryValidateStatus: A_FORM_ITEM_ERROR,
        browseDirectoryValidateMessage: "The selected directory does not contain a Puppetry project"
      });
      return false;
    }

    this.setState({ locked: false,  browseDirectoryValidateStatus: A_FORM_ITEM_SUCCESS });
    return true;
  }

  getSelectedDirectory = ( selectedDirectory ) => {
    this.setState({ selectedDirectory, locked: false });
  }

  render() {
    const { isVisible } = this.props,
          { getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="Open Project"
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          footer={[
            ( <Button key="back" onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button key="submit" type="primary"
              autoFocus={ true }
              disabled={ this.hasErrors( getFieldsError() ) || this.state.locked }
              onClick={this.onClickOk}>
              Open
            </Button> )
          ]}
        >
          <Form >

            <BrowseDirectory
              defaultDirectory={ this.state.projectDirectory }
              validateStatus={ this.state.browseDirectoryValidateStatus }
              validateMessage={ this.state.browseDirectoryValidateMessage }
              getSelectedDirectory={ this.getSelectedDirectory }
              label="Project location" />

          </Form>
        </Modal>
      </ErrorBoundary>
    );
  }
}
