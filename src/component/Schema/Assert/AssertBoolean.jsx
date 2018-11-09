import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Input, Checkbox } from "antd";

const FormItem = Form.Item;

export class AssertBoolean extends React.Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    targets: PropTypes.arrayOf( PropTypes.object ),
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record } = this.props,
          value = typeof record.assert.value === "undefined" ? true : Boolean( record.assert.value );

    return (
      <Row gutter={24}>

        <Col className="is-hidden" >
          <FormItem>
            { getFieldDecorator( "assert.assertion", {
              initialValue: "boolean"
            })( <Input readOnly disabled /> ) }
          </FormItem>
        </Col>

        <Col>
          <FormItem label="Value">
            { getFieldDecorator( "assert.value", {
              initialValue: true,
              valuePropName: ( value ? "checked" : "data-ok" )
            })(
              <Checkbox>is true</Checkbox>
            ) }
          </FormItem>
        </Col>

      </Row> );
  }
}
