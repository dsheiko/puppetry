import React from "react";
import PropTypes from "prop-types";
import { Form,  Row, Col, Select, Input } from "antd";
import If from "component/Global/If";
import { getAssertion } from "./helpers";
import AbstractComponent from "component/AbstractComponent";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertConsoleMessage extends AbstractComponent {

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
          { record } = this.props,
          assertion = this.state.assertion || getAssertion( record ).assertion || "equals",
          type = this.state.type || record.assert.type || "string",
          value = record.assert.value || "";
    return (<React.Fragment>
      <Row gutter={24} >
          <Col span={8} >
            <FormItem label="Message Type">
              { getFieldDecorator( "assert.type", {
                initialValue: type,
                rules: [{
                  required: true
                }]
              })( <Select >
              <Option value="any">any</Option>
              <Option value="log">log</Option>
              <Option value="debug">debug</Option>
              <Option value="info">info</Option>
              <Option value="error">error</Option>
              <Option value="warning">warning</Option>
              <Option value="dir">dir</Option>
              <Option value="dirxml">dirxml</Option>
              <Option value="table">table</Option>
              <Option value="trace">trace</Option>
              <Option value="time">time</Option>
              <Option value="assert">assert</Option>
              <Option value="count">count</Option>
            </Select> ) }
            </FormItem>
          </Col>
      </Row>
      <Row gutter={24}>

        <Col span={8} >
          <FormItem label="Message">
            { getFieldDecorator( "assert.assertion", {
              initialValue: assertion,
              rules: [{
                required: true
              }]
            })( <Select
              onSelect={ this.onSelectAssertion }>
              <Option value="not.equals">equals</Option>
              <Option value="not.contains">contains</Option>
            </Select> ) }
          </FormItem>
        </Col>



        <If exp={ !!assertion }>
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
            <div className="under-field-decription">You can use
              { "" } <a onClick={ this.onExtClick } href="https://docs.puppetry.app/template">
              template expressions</a>
            </div>
          </Col>
        </If>



      </Row>
      </React.Fragment>);
  }
}
