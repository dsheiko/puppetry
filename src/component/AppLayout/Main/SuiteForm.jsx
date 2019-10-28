import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { ruleValidateGenericString } from "service/utils";
import { message, Form, Icon, Input, InputNumber, Button } from "antd";
const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class SuiteForm extends AbstractForm {

  static propTypes = {
    title: PropTypes.string,
    timeout: PropTypes.number,
    form: PropTypes.shape({
      validateFieldsAndScroll: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired,
      getFieldsError: PropTypes.func.isRequired
    }),
    action: PropTypes.shape({
      updateSuite: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired
    })
  }

  onSubmit = ( e ) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll( ( err, values ) => {
      if ( !err ) {
        const title = values.title,
              timeout = values.timeout,
              { updateSuite, autosaveSuite }  = this.props.action;

        updateSuite({ title, timeout });
        autosaveSuite();
        message.info( `Data has been successfully updated` );
        this.props.form.resetFields();
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form id="cSuiteForm" onSubmit={ this.onSubmit }>
        <FormItem  label="Suite title">
          { getFieldDecorator( "title", {
            initialValue: this.props.title,
            rules: [
              {
                required: true, message: "Please enter suite name"
              },
              {
                validator: ruleValidateGenericString
              },
              {
                transform: ( value ) => value.trim()
              }
            ]
          })(
            <Input
              onPressEnter={this.onSubmit}
              placeholder="Describe suite"
              prefix={ <Icon type="profile" title="Suite" /> }
            />
          )}

        </FormItem>
        <FormItem  label="Test timeout (ms)">
          { getFieldDecorator( "timeout", {
            initialValue: ( this.props.timeout || 50000 ),
            rules: [
              {
                required: true, message: "Please enter timeout (ms)"
              }
            ]
          })(
            <InputNumber
              onPressEnter={this.onSubmit}
            />
          )}

        </FormItem>
        <FormItem>
          <Button
            id="cSuiteFormChangeBtn"
            type="primary"
            htmlType="submit"
            disabled={ this.hasErrors( getFieldsError() ) }
          >Save</Button>
        </FormItem>
      </Form>
    );
  }
}
