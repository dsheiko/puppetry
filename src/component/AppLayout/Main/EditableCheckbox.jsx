import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Form, Checkbox } from "antd";

const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class EditableCheckbox extends AbstractComponent {

  static propTypes = {
    dataIndex: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    record: PropTypes.object.isRequired,
    updateRecord: PropTypes.func.isRequired,
    prefixIcon: PropTypes.any,
    model: PropTypes.string,
    form: PropTypes.any
  }

  state = {
    value: "",
    error: ""
  }

  onChange = ( e ) => {
    this.props.liftStateUp({
      record: this.props.record,
      hidden: e.target.checked
    });
  }

  render() {
    const { dataIndex, record } = this.props,
          { getFieldDecorator } = this.props.form,
          { editing } = record,
          value = this.props.record[ dataIndex ];

    return (
      <div className="editable-cell">
        {
          editing ? (
            <Form className="cell-form">
              <FormItem>
                { getFieldDecorator( dataIndex, {
                  initialValue: value,
                  valuePropName: ( value ? "checked" : "data-ok" )
                })(
                  <Checkbox
                    onChange={ this.onChange }
                    tabIndex={ 3 }>
                    <span>hidden <span className="is-optional">(please, use for sensitive data <a
                      onClick={ this.onExtClick }
                      href="https://docs.puppetry.app/template#environment-variables">env variables</a>)</span>
                    </span>
                  </Checkbox>
                )}
              </FormItem>
            </Form>
          ) : null
        }
      </div>
    );
  }
}