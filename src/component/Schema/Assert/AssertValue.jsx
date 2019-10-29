import React from "react";
import PropTypes from "prop-types";
import { Form,  Row, Col, Select, Input, InputNumber, Checkbox } from "antd";
import If from "component/Global/If";
import { getAssertion } from "./helpers";
import AbstractComponent from "component/AbstractComponent";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertValue extends AbstractComponent {

  state = {
    assertion: "",
    type: ""
  }

  static propTypes = {
    record: PropTypes.object.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  onSelectAssertion = ( value ) => {
    this.setState({
      assertion: value
    });
  }

  onSelectType = ( value ) => {
    this.setState({
      type: value
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record, options } = this.props,
          hasBoolean = !!( options && options.boolean ),
          assertion = this.state.assertion || getAssertion( record ).assertion || "equals",
          type = this.state.type || record.assert.type || "string",
          value = record.assert.value || "";
    return (
      <Row gutter={24}>

        <Col span={8} >
          <FormItem label="Result">
            { getFieldDecorator( "assert.assertion", {
              initialValue: assertion,
              rules: [{
                required: true
              }]
            })( <Select
              onSelect={ this.onSelectAssertion }>
              <Option value="equals">equals</Option>
              <Option value="contains">contains</Option>
              <Option value="!equals">does not equal</Option>
              <Option value="!contains">does not contain</Option>
            </Select> ) }
          </FormItem>
        </Col>

        <If exp={ ( hasBoolean && ( assertion === "equals" || assertion === "!equals" ) ) }>
          <Col span={4} >
            <FormItem label="Type">
              { getFieldDecorator( "assert.type", {
                initialValue: type,
                rules: [{
                  required: true
                }]
              })( <Select showSearch optionFilterProp="children" onSelect={ this.onSelectType }>
                <Option value="string">string</Option>
                <Option value="boolean">boolean</Option>
              </Select> ) }
            </FormItem>
          </Col>
        </If>

        <If exp={ ( assertion === "contains" || assertion === "!contains" ) }>
          <Col span={12} >
            <FormItem label="Value">
              { getFieldDecorator( "assert.value", {
                initialValue: value,
                rules: [{
                  required: true
                }]
              })(
                <Input />
              ) }
            </FormItem>
            { type === "string" && <div className="under-field-description">You can use
              { "" } <a onClick={ this.onExtClick } href="https://docs.puppetry.app/template">
              template expressions</a>
            </div> }
          </Col>
        </If>

        <If exp={ ( ( assertion === "equals" || assertion === "!equals" ) && !!type ) }>
          <Col span={12} >

            <If exp={ type === "boolean" }>
              <FormItem label="Value">
                { getFieldDecorator( "assert.value", {
                  initialValue: value,
                  valuePropName: "checked" 
                })(
                  <Checkbox>is true</Checkbox>
                ) }
              </FormItem>
            </If>

            <If exp={ type !== "boolean" }>
              <FormItem label="Value">
                { getFieldDecorator( "assert.value", {
                  initialValue: value
                })(
                  this.renderValueInput( type )
                ) }
              </FormItem>
              { type === "string" && <div className="under-field-description">You can use
                { "" } <a onClick={ this.onExtClick } href="https://docs.puppetry.app/template">
                template expressions</a>
              </div> }
            </If>

          </Col>
        </If>

      </Row> );
  }

  renderValueInput( type ) {
    switch ( true ) {
    case type === "number":
      return <InputNumber />;
    default:
      return <Input />;
    }
  }

}
