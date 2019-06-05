import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button } from "antd";
import BrowseDirectory from "component/Global/BrowseDirectory";
import ErrorBoundary from "component/ErrorBoundary";
import { isProject } from "service/io";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS } from "constant";
import * as classes from "./classes";

const connectForm = Form.create();

@connectForm
export class OpenProjectModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      loadProject: PropTypes.func.isRequired,
      saveSettings: PropTypes.func.isRequired
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
    this.props.action.setApp({ openProjectModal: false });
  }

  onClickOk = async ( e ) => {
    const { setApp, loadProject, saveSettings } = this.props.action,
          projectDirectory = this.state.selectedDirectory || this.props.projectDirectory;

    e.preventDefault();
    if ( !this.isBrowseDirectoryValid() ) {
      return;
    }
    saveSettings({ projectDirectory });
    setApp({ openProjectModal: false });
    await loadProject();
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

  // Do not update until visible
  shouldComponentUpdate( nextProps, nextState ) {
    if ( this.props.isVisible !== nextProps.isVisible ) {
      return true;
    }
    if ( !nextProps.isVisible ) {
      return false;
    }
    return true;
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
            ( <Button
              className={ classes.BTN_CANCEL }
              key="back"
              onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button
              className={ classes.BTN_OK }
              key="submit"
              type="primary"
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
