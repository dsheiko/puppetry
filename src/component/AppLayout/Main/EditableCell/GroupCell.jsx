/*eslint no-unused-vars: 0*/
import React from "react";
import { Form, Input } from "antd";
import { ruleValidateNotEmptyString, ruleValidateVariable } from "service/utils";
import { AbstractEditableCell } from "./AbstractEditableCell";
const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class GroupCell extends AbstractEditableCell {
  onClickOptions = () => {
    this.props.action.setApp({ groupOptionsModal: { isVisible: true } });
  }

  render() {
      const { placeholder, dataIndex, record, prefixIcon, className, type } = this.props,
            { getFieldDecorator } = this.props.form,
            { editing } = record,
            inputOtherProps = type ? { type } : {},
            value = this.props.record[ dataIndex ];

      return (
        <div className="editable-cell">
          {
            editing ? (
              <Form className="cell-form">
                <FormItem>
                  { getFieldDecorator( dataIndex, {
                    initialValue: value,
                    rules: [
                      {
                        validator: ( dataIndex === "target"
                          || ( this.props.model === "Variable" && dataIndex === "name" ) )
                          ? ruleValidateVariable : ruleValidateNotEmptyString
                      },
                      {
                        transform: ( value ) => value.trim()
                      }
                    ]
                  })(
                    <Input
                      { ...inputOtherProps }
                      prefix={ prefixIcon || null }
                      className={ className || null }
                      onKeyPress={ ( e ) => this.onKeyPress( e, record ) }
                      onKeyDown={ ( e ) => this.onKeyDown( e, record ) }
                      placeholder={placeholder}
                      tabIndex={ dataIndex === "select" ? 2 : 1 }
                    />
                  )}

                </FormItem>
                <a onClick={ this.onClickOptions }>Options</a>
              </Form>
            ) : (
              <div className="container--editable-cell">
                { prefixIcon || null }
                { this.normalizeValue( value, type ) }
              </div>
            )
          }
        </div>
      );
    }
  }