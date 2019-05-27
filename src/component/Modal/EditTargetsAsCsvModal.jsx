import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import * as classes from "./classes";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create(),
      { TextArea } = Input;

@connectForm
export class EditTargetsAsCsvModal extends AbstractForm {

  static propTypes = {
    isVisible: PropTypes.bool.isRequired
  }

  state = {
    displayFilename: ""
  };

  close() {
    this.props.action.setApp({ editTargetsAsCsvModal: false });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  onClickOk = ( e ) => {
    const { clearTarget, addTarget } = this.props.action,
          { validateFields } = this.props.form;

    e.preventDefault();
    validateFields( ( err, values ) => {
      if ( err ) {
        return;
      }
      const data = values.csv.split( "\n" )
        .filter( line => line.trim() )
        .map( line => {
          const chunks = line.split( "," ),
                target = chunks.shift(),
                selector = chunks.join( "," );

          return {
            target,
            selector
          };
        });

      clearTarget();
      data.forEach( chunk => {
        addTarget( chunk );
      });
      this.close();
    });
  }

  render() {
    const { isVisible, targets } = this.props,
          initialValue = Object.values( targets )
            .map( row => `${ row.target },${ row.selector }` ).join( "\n" ),
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="Edit targets as CSV"
          visible={ isVisible }
          className="c-new-suite-modal"
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

          <Form>
            <FormItem  label="Targets">
              { getFieldDecorator( "csv", {
                initialValue,
                rules: [{
                  required: true,
                  message: "Please enter export table"
                }]
              })(
                <TextArea autosize={{ minRows: 8, maxRows: 12 }} />
              )}
            </FormItem>
          </Form>

        </Modal>
      </ErrorBoundary>
    );
  }
}

