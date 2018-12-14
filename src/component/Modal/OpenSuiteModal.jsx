import React from "react";
import PropTypes from "prop-types";
import { basename } from "path";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button } from "antd";
import BrowseFile from "component/Global/BrowseFile";
import ErrorBoundary from "component/ErrorBoundary";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS } from "constant";
import * as classes from "./classes";

const connectForm = Form.create();

@connectForm
export class OpenSuiteModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired,
      openSuiteFile: PropTypes.func.isRequired
    }),
    isVisible: PropTypes.bool.isRequired,
    projectDirectory: PropTypes.string
  }

  state = {
    locked: false,
    browseFilValidateStatus: "",
    browseFilValidateMessage: "",
    selectedFile: ""
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ openSuiteModal: false });
  }

  onClickOk = async ( e ) => {
    const { openSuiteFile } = this.props.action,
          selectedFile = this.state.selectedFile;

    e.preventDefault();
    if ( !this.isBrowseDirectoryValid() ) {
      return;
    }

    openSuiteFile( basename( selectedFile ) );
    this.props.action.updateApp({ openSuiteModal: false });
  }

  isBrowseDirectoryValid() {
    if ( !this.state.selectedFile ) {
      this.setState({ locked: true,  browseFilValidateStatus: A_FORM_ITEM_ERROR });
      return false;
    }

    this.setState({ locked: false,  browseFilValidateStatus: A_FORM_ITEM_SUCCESS });
    return true;
  }

  getSelectedFile = ( selectedFile ) => {
    this.setState({ selectedFile, locked: false });
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

            <BrowseFile
              validateStatus={ this.state.browseFilValidateStatus }
              validateMessage={ this.state.browseFilValidateMessage }
              getSelectedFile={ this.getSelectedFile }
              defaultPath={ this.props.projectDirectory }
              label="Select a suite" />

          </Form>
        </Modal>
      </ErrorBoundary>
    );
  }
}
