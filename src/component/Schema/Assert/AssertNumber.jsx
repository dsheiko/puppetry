import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Select, Input, InputNumber } from "antd";
import { getAssertion } from "./helpers";
import { result } from "service/utils";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertNumber extends React.Component {

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

  onSelectAssertion = ( value ) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ operator: value });
  }


  render () {
    const { getFieldDecorator } = this.props.form,
          { record, options } = this.props,
          operator = getAssertion( record ).operator || "eq",
          value = getAssertion( record ).value || 0,
          resultLabel = result( options, "resultLabel", "Result is" );
    return (
      <Row gutter={24}>
        <Col span={2} >
          <div className="ant-row ant-form-item ant-form-item--like-input">
            { resultLabel }
          </div>
          <FormItem label="Result" className="is-hidden">
            { getFieldDecorator( "assert.assertion", {
              initialValue: "number",
              rules: [{
                required: true
              }]
            })( <Input readOnly /> ) }
          </FormItem>
        </Col>

        <Col span={4} >
          <FormItem>
            { getFieldDecorator( "assert.operator", {
              initialValue: operator,
              rules: [{
                required: true
              }]
            })( <Select showSearch optionFilterProp="children" >
              <Option value="eq">=</Option>
              <Option value="gt">&gt;</Option>
              <Option value="lt">&lt;</Option>
            </Select> ) }
          </FormItem>
        </Col>

        <Col span={12} >
          <FormItem>
            { getFieldDecorator( "assert.value", {
              initialValue: value,
              rules: [{
                required: true
              }]
            })( <InputNumber onPressEnter={ ( e ) => this.props.onPressEnter( e ) } /> )
            }
          </FormItem>
        </Col>

      </Row> );
  }

}
