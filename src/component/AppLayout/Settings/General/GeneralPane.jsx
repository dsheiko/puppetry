import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";
import { result } from "service/utils";
import { FIELDSET_DEFAULT_LAYOUT } from "constant";
import { Form, Select, Button, Checkbox, message } from "antd";
const FormItem = Form.Item,
      { Option } = Select,
      connectForm = Form.create();

@connectForm
export class GeneralPane extends AbstractComponent {

  static propTypes = {
    action: PropTypes.object.isRequired,
    settings: PropTypes.object
  }

  state = {
    modified: false
  }

  onChange = () => {
    this.setState({ modified: true });
  }

  handleSubmit = ( e = null ) => {
    e && e.preventDefault();
    this.setState({ modified: false });
    this.props.form.validateFieldsAndScroll( ( err, values ) => {
      if ( err ) {
        return;
      }
      this.props.action.saveSettings({
        autosave: values.autosave,
        testCaseStyle: "gherkin"
      });
      message.info( `Data has been successfully updated` );
    });
  }

  render() {
    const { settings } = this.props,
          { getFieldDecorator } = this.props.form,
          autosave = result( settings, "autosave", true );

    return ( <ErrorBoundary>
      <Form id="cGitconfigForm" onSubmit={ this.handleSubmit }>

        <p>Here you can specify Puppetry settings.</p>

        <FormItem className="ant-form-item--layout">
          { getFieldDecorator( "autosave", {
            initialValue: autosave,
            valuePropName: ( autosave ? "checked" : "data-ok" )
          })(
            <Checkbox onChange={ this.onChange }>save changes automatically</Checkbox>
          )}
        </FormItem>

        <FormItem>
          <div className="ant-col ant-col-3">
            <Button
              id="cSettingsFormSaveBtn"
              type="primary"
              htmlType="submit"
              disabled={ !this.state.modified }
            >Save</Button>
          </div>
          <div className="ant-col ant-col-21 form-buttons" style={{ maxWidth: 200 }}>
          </div>
        </FormItem>

      </Form>
    </ErrorBoundary> );
  }
}
