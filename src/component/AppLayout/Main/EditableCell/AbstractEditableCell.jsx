import React from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";
import { ruleValidateNotEmptyString, ruleValidateVariable } from "service/utils";
const FormItem = Form.Item;

export class AbstractEditableCell extends React.Component {

  static propTypes = {
    dataIndex: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    record: PropTypes.object.isRequired,
    updateRecord: PropTypes.func.isRequired,
    prefixIcon: PropTypes.any,
    model: PropTypes.string,
    type: PropTypes.string,
    form: PropTypes.any
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

  onKeyDown = ( e, record ) => {
    switch ( e.key ) {
    case "Escape":
      this.props.updateRecord && this.props.updateRecord({ id: record.id, editing: false });
      return;
    }
  }

  normalizeValue( value, type ) {
    if ( !value ) {
      return "";
    }
    return type === "password" ? value.replace( /./g, "*" ) : value;
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