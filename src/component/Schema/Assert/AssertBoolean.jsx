import React from "react";
import PropTypes from "prop-types";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Row, Col, Input, Checkbox } from "antd";
import { getAssertion } from "./helpers";
import { result } from "service/utils";

const FormItem = Form.Item;

export class AssertBoolean extends React.Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    onPressEnter: PropTypes.func.isRequired,
    targets: PropTypes.arrayOf( PropTypes.object ),
    options: PropTypes.object,
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record, options } = this.props,
          assert = getAssertion( record ),
          value = typeof assert.value === "undefined" ? true : Boolean( assert.value ),
          textNode = result( options, "textNode", "is true" );

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
          <FormItem label="Result">
            { getFieldDecorator( "assert.value", {
              initialValue: value,
              valuePropName: "checked"
            })(
              <Checkbox>{ textNode }</Checkbox>
            ) }
          </FormItem>
        </Col>

      </Row> );
  }
}
