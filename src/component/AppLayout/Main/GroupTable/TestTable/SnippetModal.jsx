import React from "react";
import PropTypes from "prop-types";
import { InstantModal } from "component/Global/InstantModal";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractForm from "component/AbstractForm";
import { SnippetVariables } from "./SnippetVariables";
import { Collapse, Table, Spin, Form, Modal, Button, Input, Select } from "antd";

const FormItem = Form.Item,
      connectForm = Form.create(),
      Panel = Collapse.Panel,
      Option = Select.Option;

@connectForm
export class SnippetModal extends AbstractForm {


  state = {
    loading: false,
    variables: {}
  }


  onClickOk = async ( e ) => {
    const { validateFields } = this.props.form,
          { action, record } = this.props;
    e.preventDefault();

    validateFields( async ( err, values ) => {
      const { name } = values;
      if ( err ) {
        return;
      }

      record.variables = this.state.variables;

      if ( record.id ) {
        action.updateCommand({ ...record, ref: values.snippet, isRef: true });
      } else {
        action.addCommand({ ...record, ref: values.snippet, isRef: true });
      }
      this.close();
    });
  }

  close() {
    const { setApp } = this.props.action;
    setApp({
      snippetModal: {
        isVisible: false
      }
    });
  }

  onVariablesChanged = ( variables ) => {
    this.setState({ variables });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  render() {

    const { isVisible, snippets, record } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form,
          { loading } = this.state;

    return ( <ErrorBoundary>
      <InstantModal
        visible={ isVisible }
        title="Edit Reference"
        id="cCommandModal"
        onCancel={ this.onClickCancel }
        footer={[
          <Button key="back" onClick={ this.onClickCancel }>Cancel</Button>,
          <Button key="submit" type="primary"
            loading={ loading }
            onClick={ this.onClickOk }>
              Save
          </Button>
        ]}
      >
        <Form>

          <FormItem  label="Snippet">
            { getFieldDecorator( "snippet", {
              initialValue: ( record ? record.ref :  null ),
              rules: [
                {
                  required: true,
                  message: "Please select a snippet"
                }
              ]
            })(
              <Select
                showSearch
                placeholder="Select a snippet"
                filterOption={( input, option ) => (
                  option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0 )
                }
              >
                {
                  Object.values( snippets ).map( snippet => ( <Option key={ snippet.id }>
                    { snippet.title }</Option> ) )
                }
              </Select>
            )}
          </FormItem>

        </Form>
        <SnippetVariables record={ record } onChanged={ this.onVariablesChanged } />
      </InstantModal>
    </ErrorBoundary> );
  }
}
