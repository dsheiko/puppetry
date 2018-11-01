import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input } from "antd";
import ErrorBoundary from "component/ErrorBoundary";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class NewSuiteModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired,
      createSuite: PropTypes.func.isRequired
    }),

    isVisible: PropTypes.bool.isRequired
  }


  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ newSuiteModal: false });
  }

  onClickOk = ( e ) => {
    const { createSuite, updateApp } = this.props.action,
          { validateFields } = this.props.form;

    e.preventDefault();
    validateFields( ( err, values ) => {
      const { title, filename } = values;
      if ( err ) {
        return;
      }
      createSuite( filename, title );
      updateApp({ newSuiteModal: false });
    });
  }

  render() {
    const { isVisible } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="New Suite"
          visible={ isVisible }
          disabled={ this.hasErrors( getFieldsError() )  }
          closable
          onCancel={this.onClickCancel}
          footer={[
            ( <Button autoFocus={ true } key="submit" type="primary" onClick={this.onClickOk}>
              Create
            </Button> ) ]}
        >

          <Form >
            <FormItem  label="Suite title">
              { getFieldDecorator( "title", {
                rules: [{
                  required: true,
                  message: "Please enter suite title"
                }]
              })(
                <Input placeholder="e.g. Main page" />
              )}
            </FormItem>
            <FormItem  label="Suite filename (without extension)">
              { getFieldDecorator( "filename", {
                rules: [{
                  required: true,
                  message: "Please enter suite filename"
                },
                {
                  pattern: /^[0-9a-zA-Z_\-\.]{3,250}$/,
                  message: "Invalid filename"
                }]
              })(
                <Input placeholder="e.g. main-page" />
              )}
            </FormItem>

          </Form>

        </Modal>
      </ErrorBoundary>
    );
  }
}

