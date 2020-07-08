import React from "react";
import { InstantModal } from "component/Global/InstantModal";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractForm from "component/AbstractForm";
import { SnippetVariables } from "./SnippetVariables";
import { Form, Button, Select, Input } from "antd";
import { SELECT_SEARCH_PROPS } from "service/utils";

const FormItem = Form.Item,
      connectForm = Form.create(),
      Option = Select.Option;

@connectForm
export class SnippetModal extends AbstractForm {


  state = {
    loading: false,
    variables: {}
  }


  onClickOk = async ( e ) => {
    const { validateFields } = this.props.form,
          { action, record, snippets } = this.props;
    e.preventDefault();

    validateFields( async ( err, values ) => {
      if ( err ) {
        return;
      }

      const match = Object.values( snippets ).find( s => s.id === values.snippet );

      record.variables = this.state.variables;

      if ( record.id ) {
        action.updateCommand({
          ...record, ref: values.snippet, comment: values.comment, isRef: true, refName: match.title
        });
      } else {
        action.addCommand({
          ...record, ref: values.snippet, comment: values.comment, isRef: true, refName: match.title
        });
      }
      this.props.action.autosaveSuite();
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
          { getFieldDecorator } = this.props.form,
          { loading } = this.state;

    return ( <ErrorBoundary>
      <InstantModal
        visible={ isVisible }
        title="Edit Reference"
        id="cCommandModal"
        onCancel={ this.onClickCancel }
        footer={[
          <Button key="back"
            className="btn--modal-snippet-cancel"
            onClick={ this.onClickCancel }>Cancel</Button>,
          <Button key="submit" type="primary"
            loading={ loading }
            className="btn--modal-snippet-ok"
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
                placeholder="Select a snippet"
                { ...SELECT_SEARCH_PROPS }
              >
                {
                  Object.values( snippets ).map( snippet => ( <Option key={ snippet.id }>
                    { snippet.title }</Option> ) )
                }
              </Select>
            )}
          </FormItem>

          <FormItem label="Comment (optional)">
            { getFieldDecorator( "comment", {
              initialValue: ( record ? record.comment :  null )
            })(
              <Input placeholder="Explain your intent" onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
            )}
          </FormItem>

        </Form>

        <SnippetVariables record={ record } onChanged={ this.onVariablesChanged } />


      </InstantModal>
    </ErrorBoundary> );
  }
}
