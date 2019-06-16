import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Input, Checkbox } from "antd";
import { getAssertion } from "./helpers";

const FormItem = Form.Item;

export class AssertTrue extends React.Component {

  static propTypes = {
    targets: PropTypes.arrayOf( PropTypes.object ),
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row gutter={24}>

        <Col className="is-hidden">
          <FormItem>
            { getFieldDecorator( "assert.assertion", {
              initialValue: "boolean"
            })( <Input readOnly disabled /> ) }
          </FormItem>
        </Col>

        <Col>
          <FormItem label="Value" className="is-hidden">
            { getFieldDecorator( "assert.value", {
              initialValue: true,
              valuePropName: "checked"
            })(
              <Checkbox>is true</Checkbox>
            ) }
          </FormItem>
          is true
        </Col>

      </Row> );
  }
}
