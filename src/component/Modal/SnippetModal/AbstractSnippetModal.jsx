import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input, Row, Col, Collapse } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { normalizeFilename } from "service/io";
import { ruleValidateGenericString } from "service/utils";
import * as classes from "../classes";
import mediator from "service/mediator";
import { MODAL_DEFAULT_PROPS, RE_SNIPPETS_TEST_ADDED } from "constant";

const FormItem = Form.Item;

export default class AbstractSnippetModal extends AbstractForm {


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
    const { isVisible, data, title } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title={ title }
          visible={ isVisible }
          className="c-new-snippet-modal"
          disabled={ this.hasErrors( getFieldsError() )  }
          closable
          onCancel={this.onClickCancel}
          { ...MODAL_DEFAULT_PROPS }
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
            <FormItem  label="Snippet name">
              { getFieldDecorator( "title", {
                initialValue: data.title,
                rules: [{
                  required: true,
                  message: "Please enter snippet name"
                },
                {
                  validator: ruleValidateGenericString
                },
                {
                  transform: ( value ) => value.trim()
                }]
              })(
                <Input onChange={ this.onNameChange } placeholder="e.g. Fill out the form"
                  onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
              )}
            </FormItem>
          </Form>

        </Modal>
      </ErrorBoundary>
    );
  }

}
