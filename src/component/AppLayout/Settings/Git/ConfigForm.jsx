import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { ruleValidateGenericString } from "service/utils";
import { message, Form, Radio, Select, Icon, Input, InputNumber, Button, Card } from "antd";
const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class ConfigForm extends AbstractForm {

  onSubmit = ( e ) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll( ( err, values ) => {
      if ( !err ) {
        const { saveProjectGit }  = this.props.action;
        saveProjectGit( values );
        this.props.form.resetFields();
        message.info( `Data has been successfully updated` );
      }
    });
  }

  render() {
    const { git } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form id="cGitconfigForm" className="settings-git-form" onSubmit={ this.onSubmit }>

        <h3>Git Config</h3>
        <p>Please provide your identity data. Every Git commit uses this information, so it's quite important.</p>


          <FormItem  label="Full Name">
            { getFieldDecorator( "configUsername", {
              initialValue: git.configUsername,
              rules: [
                {
                  required: true, message: "Please enter full name"
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
                placeholder="e.g. Jon Snow"
              />
            )}
          </FormItem>

        <FormItem  label="Email">
          { getFieldDecorator( "configEmail", {
            initialValue: git.configEmail,
            rules: [
              {
                required: true, message: "Please enter email"
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
              placeholder="e.g. jon@example.com"
            />
          )}
        </FormItem>


        <FormItem className="form-buttons">
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
