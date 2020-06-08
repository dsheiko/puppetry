import React from "react";
import PropTypes from "prop-types";
import { Form,  Row, Col, Select, Input, Checkbox } from "antd";
import If from "component/Global/If";
import { getAssertion } from "./helpers";
import AbstractComponent from "component/AbstractComponent";
import Tooltip from "component/Global/Tooltip";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertDialog extends AbstractComponent {

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
          assertion = this.state.assertion || getAssertion( record ).assertion || "haveString",
          not = getAssertion( record ).not || "false",
          type = this.state.type || record.assert.type || "any",
          value = record.assert.value || "";
    return ( <React.Fragment>

      { /* Force template parsing */"" }
      <FormItem className="is-hidden">
        { getFieldDecorator( "assert.assertionType", {
          initialValue: "string"
        })(
          <Input />
        ) }
      </FormItem>

      <span className="assert-there-were"><span>Assert there</span><FormItem>
        { getFieldDecorator( "assert.not", {
          initialValue: not,
          rules: [{
            required: true
          }]
        })( <Select>
          <Option value="false">were</Option>
          <Option value="true">were NO</Option>
        </Select> ) }
      </FormItem>
      <span>dialogs called like the following</span></span>

      <Row gutter={24} >
        <Col span={8} >
          <FormItem label="Dialog type">
            { getFieldDecorator( "assert.type", {
              initialValue: type,
              rules: [{
                required: true
              }]
            })( <Select showSearch optionFilterProp="children">
              <Option value="any">any</Option>
              <Option value="alert">alert</Option>
              <Option value="beforeunload">beforeunload</Option>
              <Option value="confirm">confirm</Option>
              <Option value="prompt">prompt</Option>
            </Select> ) }
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>

        <Col span={8} >
          <FormItem label="Dialog message">
            { getFieldDecorator( "assert.assertion", {
              initialValue: assertion,
              rules: [{
                required: true
              }]
            })( <Select
              onSelect={ this.onSelectAssertion }>
              <Option value="haveString">equals</Option>
              <Option value="haveSubstring">contains</Option>
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
                <Input onPressEnter={ ( e ) => this.props.onPressEnter( e ) } />
              ) }
            </FormItem>
            <div className="under-field-description">You can use
              { "" } <a onClick={ this.onExtClick } href="https://docs.puppetry.app/template">
              template expressions</a>
            </div>
          </Col>
        </If>


      </Row>
      <Row gutter={24}>
        <Col span={ 24 } >
          <FormItem >
            { getFieldDecorator( "assert.reset", {
              initialValue: typeof record.assert.reset === "undefined" ? true : record.assert.reset,
              valuePropName: "checked"
            })( <Checkbox>flush the stack of dialog calls <Tooltip
              title="Tick it off we you do sequential assertions after a single event"
              icon="question-circle"
              pos="up-left"
            /></Checkbox> ) }
          </FormItem>
        </Col>
      </Row>
    </React.Fragment> );
  }
}
