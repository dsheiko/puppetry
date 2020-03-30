import React from "react";
import PropTypes from "prop-types";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Row, Col, Select, Input } from "antd";
import If from "component/Global/If";
import { getAssertion } from "./helpers";
import AbstractComponent from "component/AbstractComponent";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertString extends AbstractComponent {

  state = {
    assertion: "",
    type: ""
  }

  static propTypes = {
    record: PropTypes.object.isRequired,
    onPressEnter: PropTypes.func.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  onSelectAssertion = ( value ) => {
    this.setState({
      assertion: value
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record } = this.props,
          assertion = this.state.assertion || getAssertion( record ).assertion || "equals",
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
              <Option value="empty">is empty</Option>
              <Option value="!equals">does not equal</Option>
              <Option value="!contains">does not contain</Option>
              <Option value="!empty">is not empty</Option>
            </Select> ) }
          </FormItem>
        </Col>


        <If exp={ ( assertion === "contains" || assertion === "!contains" ) }>
          <Col span={12} >
            <FormItem label="Value">
              { getFieldDecorator( "assert.value", {
                initialValue: value,
                rules: [{
                  required: true
                }]
              })(
                <Input onPressEnter={ ( e ) => this.props.onPressEnter( e ) } />
              ) }
            </FormItem>
            <div className="under-field-description">You can use
              { "" } <a onClick={ this.onExtClick } href="https://docs.puppetry.app/template">
              template expressions</a>
            </div>
          </Col>
        </If>

        <If exp={ ( ( assertion === "equals" || assertion === "!equals" ) ) }>
          <Col span={12} >

            <FormItem label="Value">
              { getFieldDecorator( "assert.value", {
                initialValue: value
              })(
                <Input onPressEnter={ ( e ) => this.props.onPressEnter( e ) } />
              ) }
            </FormItem>
            <div className="under-field-description">You can use
              { "" } <a onClick={ this.onExtClick } href="https://docs.puppetry.app/template">
                template expressions</a>
            </div>
          </Col>
        </If>

      </Row> );
  }

}
