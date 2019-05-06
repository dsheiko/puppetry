import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { ruleValidateGenericString } from "service/utils";
import { Form, Radio, Select, Input, Button } from "antd";
import { ipcRenderer } from "electron";
import { E_GIT_SET_REMOTE } from "constant";
const FormItem = Form.Item,
      RadioGroup = Radio.Group,
      Option = Select.Option,
      connectForm = Form.create();

@connectForm
export class RemoteForm extends AbstractForm {

  static propTypes = {
    action: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
  }

  setFieldInvalid( field, message ) {
    this.props.form.setFields({
      [ field ]: {
        errors: [ new Error( message ) ]
      }
    });
  }

  onSubmit = ( e ) => {
    const { git, projectDirectory } = this.props;
    e.preventDefault();

    this.props.form.validateFieldsAndScroll( ( err, values ) => {
      if ( !err ) {

        if ( values.credentialsAuthMethod === "password" && !values.credentialsPassword.trim() ) {
          return this.setFieldInvalid( "credentialsPassword",
            `For the selected authentication method password field is required` );
        }

        if ( values.credentialsAuthMethod === "accessToken" && !values.credentialsAcccessToken.trim() ) {
          return this.setFieldInvalid( "credentialsAcccessToken",
            `For the selected authentication method token field is required` );
        }

        const { saveGit }  = this.props.action;

        saveGit({ ...values, hasRemote: true });
        this.props.form.resetFields();
//
//        ipcRenderer.send(
//          E_GIT_SET_REMOTE,
//          values.remoteRepository,
//          projectDirectory,
//          {
//            credentialsAuthMethod: git.credentialsAuthMethod,
//            credentialsUsername: values.credentialsUsername,
//            credentialsPassword: values.credentialsPassword,
//            credentialsAcccessToken: values.credentialsAcccessToken
//          }
//        );
      }
    });
  }

  onAuthMethodChange = ( e ) => {
    const { setGit }  = this.props.action;
    setGit({ credentialsAuthMethod: e.target.value });
  }

  render() {
    const { git } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form id="cGitRemoteForm" className="settings-git-form" onSubmit={ this.onSubmit }>

        <h3>Git Remote Repository</h3>
        <p>Remote repository is version of your project hosted on the Internet
        (
        <a href="https://github.com/" onClick={ this.onExtClick }>github.com</a>,
        { " " }<a href="https://bitbucket.org/product/" onClick={ this.onExtClick }>bitbucket.org</a>,
        { " " }<a href="https://gitlab.com/public" onClick={ this.onExtClick }>gitlab.com</a>)
        or anywhere in the network
        (e.g. <a href="https://about.gitlab.com/install/" onClick={ this.onExtClick }>internal Gitlab server</a>).
        To be able to synchronize your
        local changes with the remote repository you need
        to provide repository location and authentication data.</p>

        <FormItem  label="Repository location">
          { getFieldDecorator( "remoteRepository", {
            initialValue: git.remoteRepository,
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

        { false && <FormItem  label="Provider">
          { getFieldDecorator( "credentialsProvider", {
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
        </FormItem> }

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

        <FormItem  label="Authentication method">
          { getFieldDecorator( "credentialsAuthMethod", {
            initialValue: git.credentialsAuthMethod
          })(
            <RadioGroup onChange={ this.onAuthMethodChange }>
              <Radio value="password">Password</Radio>
              <Radio value="accessToken">Access token</Radio>
            </RadioGroup>
          )}
        </FormItem>

        { git.credentialsAuthMethod === "password" && <FormItem  label="Password">
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

        { git.credentialsAuthMethod === "accessToken" && <React.Fragment>

          <FormItem  label="Access Token">
            { getFieldDecorator( "credentialsAcccessToken", {
              initialValue: git.credentialsAcccessToken,
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
          </FormItem>
          <p>
    Many Git providers support two-factor authentication, meaning
    you can create a Personal Access Token
    (or an App Password in Bitbucket terms) and use that to authenticate
    (
            <a href="https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/"
              onClick={ this.onExtClick }>Instructions for GitHub</a>, { " " }
            <a href="https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html"
              onClick={ this.onExtClick }>Instructions for Bitbucket</a>, { " " }
            <a href="https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html"
              onClick={ this.onExtClick }>Instructions for GitLab</a>
    ).
          </p>
        </React.Fragment> }

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
