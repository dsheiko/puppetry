import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal,  Input, Button } from "antd";
import { getBasename } from "service/io";
import ErrorBoundary from "component/ErrorBoundary";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class SaveSuiteAsModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired
    }),
    files: PropTypes.arrayOf( PropTypes.string ).isRequired,
    isVisible: PropTypes.bool.isRequired,
    filename: PropTypes.string.isRequired
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ saveSuiteAsModal: false });
  }

  onClickOk = ( e ) => {
    const { validateFields } = this.props.form,
          { updateApp, saveSuite } = this.props.action;

    e.preventDefault();

    validateFields( ( err, values ) => {
      const { filename } = values;
      if ( err ) {
        return;
      }
      updateApp({ saveSuiteAsModal: false });
      saveSuite({ filename: `${filename}.json` });
    });
  }


  validateFilename = ( rule, value, callback ) => {
    if ( this.props.files.some( file => getBasename( file ) === value ) ) {
      callback( "A suite with this name already exists" );
    }
    callback();
  }


  render() {
    const { isVisible, filename } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="Save Suite"
          visible={ isVisible }
          closable
          onCancel={ this.onClickCancel }
          footer={[
            ( <Button key="back" onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button key="submit" type="primary"
              disabled={ this.hasErrors( getFieldsError() ) }
              autoFocus={ true }
              onClick={this.onClickOk}>
              Save
            </Button> )
          ]}
        >
          <Form >
            <FormItem  label="Suite filename (without extension)">
              { getFieldDecorator( "filename", {
                initialValue: getBasename( filename ),
                rules: [
                  {
                    required: true,
                    message: "Please enter suite filename"
                  },
                  {
                    pattern: /^[0-9a-zA-Z_\-\.]{3,250}$/,
                    message: "Invalid filename"
                  },
                  {
                    validator: this.validateFilename
                  }
                ]
              })(
                <Input placeholder="e.g. my-new-suite" />
              )}
            </FormItem>
          </Form>
        </Modal>
      </ErrorBoundary>
    );
  }
}
