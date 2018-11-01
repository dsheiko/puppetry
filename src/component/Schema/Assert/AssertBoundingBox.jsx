import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Select, Input, InputNumber } from "antd";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertBoundingBox extends React.Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    targets: PropTypes.arrayOf( PropTypes.object ),
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
          { record } = this.props,
          { hOperator, hValue, wOperator, wValue, xOperator, xValue, yOperator, yValue } = record.assert;

    return (
      <React.Fragment>
        <Row gutter={24} className="is-invisible">
          <Col span={8} >
            <FormItem label="Result">
              { getFieldDecorator( "assert.assertion", {
                initialValue: "boundingBox",
                rules: [{
                  required: true
                }]
              })( <Input readOnly /> ) }
            </FormItem>
          </Col>
        </Row>


        <Row gutter={24} className="ant-form-inline">

          <FormItem>
            <Input defaultValue="x is" readOnly  />
          </FormItem>

          <FormItem>
            { getFieldDecorator( "assert.xOperator", {
              initialValue: xOperator || "gt",
              rules: [{
                required: true
              }]
            })( <Select >
              <Option value="any">any</Option>
              <Option value="gt">&gt;</Option>
              <Option value="lt">&lt;</Option>
            </Select> ) }
          </FormItem>

          <FormItem>
            { getFieldDecorator( "assert.xValue", {
              initialValue: xValue,
              rules: [{
                required: true
              }]
            })( <InputNumber /> )
            }
          </FormItem>

        </Row>

        <Row gutter={24} className="ant-form-inline">

          <FormItem>
            <Input defaultValue="y is" readOnly  />
          </FormItem>

          <FormItem>
            { getFieldDecorator( "assert.yOperator", {
              initialValue: yOperator || "gt",
              rules: [{
                required: true
              }]
            })( <Select >
              <Option value="any">any</Option>
              <Option value="gt">&gt;</Option>
              <Option value="lt">&lt;</Option>
            </Select> ) }
          </FormItem>

          <FormItem>
            { getFieldDecorator( "assert.yValue", {
              initialValue: yValue,
              rules: [{
                required: true
              }]
            })( <InputNumber /> )
            }
          </FormItem>

        </Row>

        <Row gutter={24} className="ant-form-inline">

          <FormItem>
            <Input defaultValue="width is" readOnly  />
          </FormItem>

          <FormItem>
            { getFieldDecorator( "assert.wOperator", {
              initialValue: wOperator || "gt",
              rules: [{
                required: true
              }]
            })( <Select >
              <Option value="any">any</Option>
              <Option value="gt">&gt;</Option>
              <Option value="lt">&lt;</Option>
            </Select> ) }
          </FormItem>

          <FormItem>
            { getFieldDecorator( "assert.wValue", {
              initialValue: wValue,
              rules: [{
                required: true
              }]
            })( <InputNumber /> )
            }
          </FormItem>

        </Row>

        <Row gutter={24} className="ant-form-inline">

          <FormItem>
            <Input defaultValue="height is" readOnly  />
          </FormItem>

          <FormItem>
            { getFieldDecorator( "assert.hOperator", {
              initialValue: hOperator || "gt",
              rules: [{
                required: true
              }]
            })( <Select >
              <Option value="any">any</Option>
              <Option value="gt">&gt;</Option>
              <Option value="lt">&lt;</Option>
            </Select> ) }
          </FormItem>

          <FormItem>
            { getFieldDecorator( "assert.hValue", {
              initialValue: hValue,
              rules: [{
                required: true
              }]
            })( <InputNumber /> )
            }
          </FormItem>

        </Row>


      </React.Fragment> );
  }

}
