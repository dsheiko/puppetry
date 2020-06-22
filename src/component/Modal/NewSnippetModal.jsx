import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input, Row, Col, Collapse } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { normalizeFilename } from "service/io";
import { ruleValidateGenericString } from "service/utils";
import * as classes from "./classes";
import mediator from "service/mediator";
import { MODAL_DEFAULT_PROPS, RE_SNIPPETS_TEST_ADDED } from "constant";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class NewSnippetModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      addSnippetsTest: PropTypes.func.isRequired
    }),

    isVisible: PropTypes.bool.isRequired
  }

  state = {
    displayFilename: ""
  };

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ newSnippetModal: false });
  }

  onClickOk = ( e ) => {
    e.preventDefault();
    this.createSnippet();
  }

  createSnippet = () => {
    const { addSnippetsTest, setApp } = this.props.action,
          { validateFields } = this.props.form;

    validateFields( async ( err, values ) => {
      const { title } = values;
      if ( err ) {
        return;
      }
      await addSnippetsTest({ title });
      setApp({ newSnippetModal: false });
    });
  }

  componentDidMount() {
    mediator.removeAllListeners( RE_SNIPPETS_TEST_ADDED );
    mediator.on( RE_SNIPPETS_TEST_ADDED, ( options ) => {
      this.props.action.autosaveSnippets();
      this.props.action.setProject({ lastOpenSnippetId: options.lastInsertTestId });
      this.props.action.addAppTab( "snippet" );
    });
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
    const { isVisible } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="New Snippet"
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
                initialValue: "",
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
};

