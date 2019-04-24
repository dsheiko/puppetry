import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input, Row, Col, Collapse } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { ipcRenderer } from "electron";
import { E_GIT_COMMIT } from "constant";
import * as classes from "./classes";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class GitCheckoutModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired
    }),
    git: PropTypes.object.isRequired,
    projectDirectory: PropTypes.string,
    isVisible: PropTypes.bool.isRequired
  }


  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ newGitCommitModal: false });
  }

  onClickOk = ( e ) => {
    const { createSuite, updateApp } = this.props.action,
          { git, projectDirectory } = this.props,
          { validateFields } = this.props.form;

    e.preventDefault();
    validateFields( ( err, values ) => {
      const { message } = values;
      if ( err ) {
        return;
      }
      ipcRenderer.send(
        E_GIT_COMMIT,
        message,
        projectDirectory,
        git.configUsername,
        git.configEmail
      );
      updateApp({ newGitCommitModal: false });
    });
  }


  render() {
    const { isVisible } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="New Commit"
          visible={ isVisible }
          className="c-new-git-commit-modal"
          disabled={ this.hasErrors( getFieldsError() )  }
          closable
          onCancel={this.onClickCancel}
          footer={[
            ( <Button
              autoFocus={ true }
              className={ classes.BTN_OK }
              key="submit"
              type="primary"
              onClick={this.onClickOk}>
              Create
            </Button> ) ]}
        >

          <Form >
            <FormItem
              extra="Please describe briefly the latest changes in your project.
                This message will help you to identify the commit in the version list."
              label="Commit description">
              { getFieldDecorator( "message", {
                rules: [{
                  required: true,
                  message: "Please enter commit description"
                },
                {
                  transform: ( value ) => value.trim()
                }]
              })(
                <Input onChange={ this.onNameChange } placeholder="e.g. Add page.screenshot in form submittion group"
                  onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
              )}
            </FormItem>

          </Form>

        </Modal>
      </ErrorBoundary>
    );
  }
}

