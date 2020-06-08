import React from "react";
import PropTypes from "prop-types";
import { Form,  Row, Col, Select, Input } from "antd";
import If from "component/Global/If";
import { getAssertion } from "./helpers";
import AbstractComponent from "component/AbstractComponent";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertProperty extends AbstractComponent {

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

  onSelectType = ( value ) => {
    this.setState({
      type: value
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

          { /* Force template parsing */"" }
          <FormItem className="is-hidden">
            { getFieldDecorator( "assert.assertionType", {
              initialValue: "string"
            })(
              <Input />
            ) }
          </FormItem>

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
              <Option value="hasProperty">is true</Option>
              <Option value="!equals">does not equal</Option>
              <Option value="!contains">does not contain</Option>
              <Option value="!hasProperty">is false</Option>
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

        <If exp={ ( assertion === "equals" || assertion === "!equals" ) }>
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
