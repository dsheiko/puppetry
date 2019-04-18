import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { ruleValidateGenericString } from "service/utils";
import { Form, Radio, Select, Icon, Input, InputNumber, Button, Card } from "antd";
const FormItem = Form.Item,
      RadioGroup = Radio.Group,
      Option = Select.Option,
      connectForm = Form.create();

@connectForm
export class GitPane extends AbstractForm {

  state = {
    authMethod: "password"
  }

  onSubmit = ( e ) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll( ( err, values ) => {
      console.log(values);
      if ( !err ) {
        const { setProjectGit }  = this.props.action;
        //setProjectGit()
        //this.props.form.resetFields();
      }
    });
  }

  onAuthMethodChange = ( e ) => {
    this.setState({
      authMethod: e.target.value
    });
  }

  render() {
    const { git } = this.props,
          { authMethod } = this.state,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form id="cSuiteForm" className="settings-git-form" onSubmit={ this.onSubmit }>

        <h3>Git Repository</h3>
        <p>....</p>

        <FormItem  label="Repository location">
          { getFieldDecorator( "repository", {
            initialValue: git.repository,
            rules: [
              {
                required: true, message: "Please enter repository location"
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
              placeholder="e.g. https://github.com/dsheiko/puppetry.git"
            />
          )}
        </FormItem>

        <FormItem  label="Provider">
          { getFieldDecorator( "credentialsPassword", {
            initialValue: git.credentialsProvider,
            rules: [
              {
                required: true, message: "Please select provider"
              }
            ]
          })(
             <Select>
                <Option value="gitlab">Gitlab</Option>
                <Option value="bitbucket">Bitbacket</Option>
                <Option value="github" >Github</Option>
                <Option value="other" >Other</Option>
              </Select>
          )}
        </FormItem>

        <FormItem  label="Username">
          { getFieldDecorator( "credentialsUsername", {
            initialValue: git.credentialsUsername,
            rules: [
              {
                required: true, message: "Please enter username"
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
              placeholder="e.g. jon"
            />
          )}
        </FormItem>

         <RadioGroup onChange={ this.onAuthMethodChange } value={ this.state.authMethod }>
            <Radio value="password">Password</Radio>
            <Radio value="accessToken">Access token</Radio>
        </RadioGroup>

        { authMethod === "password" && <FormItem  label="Password">
          { getFieldDecorator( "credentialsPassword", {
            initialValue: git.credentialsPassword,
            rules: [
              {
                transform: ( value ) => value.trim()
              }
            ]
          })(
            <Input
              type="password"
              onPressEnter={this.onSubmit}
            />
          )}
        </FormItem> }

        { authMethod === "accessToken" && <FormItem  label="Access Token">
          { getFieldDecorator( "credentialsAcccessToken", {
            initialValue: git.credentialsPassword,
            rules: [
              {
                transform: ( value ) => value.trim()
              }
            ]
          })(
            <Input
              type="password"
              onPressEnter={this.onSubmit}
            />
          )}
        </FormItem> }





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
