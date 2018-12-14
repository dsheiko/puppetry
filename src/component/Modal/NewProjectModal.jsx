import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Input, Button } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import BrowseDirectory from "component/Global/BrowseDirectory";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS } from "constant";
import * as classes from "./classes";

const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class NewProjectModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired,
      saveSettings: PropTypes.func.isRequired,
      saveProject: PropTypes.func.isRequired
    }),

    isVisible: PropTypes.bool.isRequired,
    projectName: PropTypes.string.isRequired,
    projectDirectory: PropTypes.string.isRequired
  }

  state = {
    locked: false,
    browseDirectoryValidateStatus: "",
    selectedDirectory: ""
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ newProjectModal: false });
  }

  onClickOk = ( e ) => {
    const { validateFields } = this.props.form,
          { updateApp, saveSettings, saveProject } = this.props.action,
          projectDirectory = this.state.selectedDirectory || this.props.projectDirectory;

    e.preventDefault();

    if ( !this.isBrowseDirectoryValid() ) {
      return;
    }

    validateFields( ( err, values ) => {
      const { name } = values;
      if ( err ) {
        return;
      }
      saveSettings({ projectDirectory });
      updateApp({ newProjectModal: false });
      saveProject({ projectDirectory, name });
    });
  }

  isBrowseDirectoryValid() {
    if ( !this.state.selectedDirectory ) {
      this.setState({ locked: true,  browseDirectoryValidateStatus: A_FORM_ITEM_ERROR });
      return false;
    }
    this.setState({ locked: false,  browseDirectoryValidateStatus: A_FORM_ITEM_SUCCESS });
    return true;
  }


  getSelectedDirectory = ( selectedDirectory ) => {
    this.setState({ selectedDirectory, locked: false });
  }


  render() {
    const { isVisible, projectName } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="New Project"
          className="c-new-project-modal"
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          footer={[
            ( <Button
              key="back"
              className={ classes.BTN_CANCEL }
              onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button
              key="submit"
              type="primary"
              className={ classes.BTN_OK }
              disabled={ this.hasErrors( getFieldsError() ) || this.state.locked }
              autoFocus={ true }
              onClick={this.onClickOk}>
              Create
            </Button> )
          ]}
        >
          <Form>
            <FormItem  label="Project name">
              { getFieldDecorator( "name", {
                initialValue: projectName,
                rules: [{
                  required: true,
                  message: "Please enter project name"
                }]
              })(
                <Input placeholder="Project name" />
              )}
            </FormItem>


            <BrowseDirectory
              defaultDirectory={ this.state.projectDirectory }
              validateStatus={ this.state.browseDirectoryValidateStatus }
              getSelectedDirectory={ this.getSelectedDirectory }
              label="Project location" />

          </Form>
        </Modal>
      </ErrorBoundary>
    );
  }
}
