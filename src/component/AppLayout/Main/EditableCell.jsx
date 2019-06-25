import React from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";
import { ruleValidateNotEmptyString, ruleValidateVariable } from "service/utils";
const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class EditableCell extends React.Component {

  static propTypes = {
    dataIndex: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    record: PropTypes.object.isRequired,
    updateRecord: PropTypes.func.isRequired,
    prefixIcon: PropTypes.any,
    model: PropTypes.string
  }

  state = {
    value: "",
    error: ""
  }


  onKeyPress = ( e, record ) => {
    switch ( e.key ){
    case "Enter":
      this.props.onSubmit && this.props.onSubmit( record );
      return;
    }
  }


  render() {
    const { placeholder, dataIndex, record, prefixIcon, className } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form,
          { editing } = record,
          value = this.props.record[ dataIndex ];

    return (
      <div className="editable-cell">
        {
          editing ? (
            <Form className="cell-form">
              <FormItem
              >

              { getFieldDecorator( dataIndex, {
                initialValue: value,
                rules: [
                {
                  validator: ( dataIndex === "target" || ( this.props.model === "Variable" && dataIndex === "name" ) )
                    ? ruleValidateVariable : ruleValidateNotEmptyString
                },
                {
                  transform: ( value ) => value.trim()
                }
                ]
              })(
                <Input
                  prefix={ prefixIcon || null }
                  className={ className || null }

                  onKeyPress={ ( e ) => this.onKeyPress( e, record ) }
                  placeholder={placeholder}
                  tabIndex={ dataIndex === "select" ? 2 : 1 }
                />
              )}

              </FormItem>
            </Form>
          ) : (
            <div className="container--editable-cell">
              { prefixIcon || null }
              { value || " " }
            </div>
          )
        }
      </div>
    );
  }
}