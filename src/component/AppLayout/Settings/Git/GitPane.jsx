import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { ruleValidateGenericString } from "service/utils";
import { Form, Icon, Input, InputNumber, Button, Card } from "antd";
const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class GitPane extends AbstractForm {

//  static propTypes = {
//    title: PropTypes.string,
//    timeout: PropTypes.number,
//    form: PropTypes.shape({
//      validateFieldsAndScroll: PropTypes.func.isRequired,
//      getFieldDecorator: PropTypes.func.isRequired,
//      getFieldsError: PropTypes.func.isRequired
//    }),
//    action: PropTypes.shape({
//      updateSuite: PropTypes.func.isRequired,
//      saveSuite: PropTypes.func.isRequired
//    })
//  }

  onSubmit = ( e ) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll( ( err, values ) => {
      if ( !err ) {
        const title = values.title,
              timeout = values.timeout,
              { updateSuite }  = this.props.action;

        updateSuite({ title, timeout });
        this.props.form.resetFields();
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form id="cSuiteForm" className="settings-git-form" onSubmit={ this.onSubmit }>

        <h3>Git Repository</h3>
        <p>....</p>

        <FormItem  label="Repository location">
          { getFieldDecorator( "repository", {
            initialValue: "",
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


        <FormItem  label="Username">
          { getFieldDecorator( "credentialsUsername", {
            initialValue: "",
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
              placeholder="e.g. jon"
            />
          )}
        </FormItem>

        <FormItem  label="Email">
          { getFieldDecorator( "credentialsPassword", {
            initialValue: "",
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
              placeholder="e.g. jon"
            />
          )}
        </FormItem>

        <h3>Git Config</h3>
        <p>Please provide your identity data. Every Git commit uses this information, so it's quite important.</p>


          <FormItem  label="Username">
            { getFieldDecorator( "configUsername", {
              initialValue: "",
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
                placeholder="e.g. jon"
              />
            )}
          </FormItem>

        <FormItem  label="Email">
          { getFieldDecorator( "configEmail", {
            initialValue: "",
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
              placeholder="e.g. jon"
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
