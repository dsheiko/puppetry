import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal,  Input, Button } from "antd";
import { getBasename } from "service/io";
import ErrorBoundary from "component/ErrorBoundary";
import * as classes from "./classes";
import { MODAL_DEFAULT_PROPS } from "constant";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class SaveSuiteAsModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired
    }),
    files: PropTypes.arrayOf( PropTypes.string ).isRequired,
    isVisible: PropTypes.bool.isRequired,
    filename: PropTypes.string.isRequired
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ saveSuiteAsModal: false });
  }

  onClickOk = ( e ) => {
    const { validateFields } = this.props.form,
          { setApp, saveSuite } = this.props.action;

    e.preventDefault();

    validateFields( ( err, values ) => {
      const { filename } = values;
      if ( err ) {
        return;
      }
      setApp({ saveSuiteAsModal: false });
      saveSuite({ filename: `${filename}.json` });
    });
  }


  validateFilename = ( rule, value, callback ) => {
    if ( this.props.files.some( file => getBasename( file ) === value ) ) {
      callback( "A suite with this name already exists" );
    }
    callback();
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
    const { isVisible, filename } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="Save Suite As"
          visible={ isVisible }
          closable
          onCancel={ this.onClickCancel }
          { ...MODAL_DEFAULT_PROPS }
          footer={[
            ( <Button
              className={ classes.BTN_CANCEL }
              key="back"
              onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button
              className={ classes.BTN_OK }
              key="submit"
              type="primary"
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
                <Input placeholder="e.g. my-new-suite" onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
              )}
            </FormItem>
          </Form>
        </Modal>
      </ErrorBoundary>
    );
  }
}
