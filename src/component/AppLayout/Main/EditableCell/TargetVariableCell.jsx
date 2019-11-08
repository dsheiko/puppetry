import React from "react";
import { Form, Input } from "antd";
import { AbstractEditableCell } from "./AbstractEditableCell";
import { ruleValidateVariable } from "service/utils";
const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class TargetVariableCell extends AbstractEditableCell {


  render() {
    const { placeholder, dataIndex, record, prefixIcon, className, type, targets } = this.props,
          { getFieldDecorator } = this.props.form,
          { editing } = record,
          inputOtherProps = type ? { type } : {},
          value = record[ dataIndex ];

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
                      validator: ruleValidateVariable
                    },
                    {
                      validator: ( rule, value, callback ) => {
                        if ( targets.find( obj => obj.target === value ) ) {
                          return callback( `Name ${ value } is already in use` );
                        }
                        callback();
                      }
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