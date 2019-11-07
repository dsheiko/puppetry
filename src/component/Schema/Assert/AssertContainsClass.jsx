import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Select } from "antd";
import { getAssertion } from "./helpers";
import AbstractComponent from "component/AbstractComponent";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertContainsClass extends AbstractComponent {

  static propTypes = {
    record: PropTypes.object.isRequired,
    onPressEnter: PropTypes.func.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record } = this.props,
          assertion = getAssertion( record ).assertion || "contains";
    return (
      <Row gutter={24}>

        <Col span={8} >
          <FormItem label="Result">
            { getFieldDecorator( "assert.assertion", {
              initialValue: assertion,
              rules: [{
                required: true
              }]
            })( <Select>
              <Option value="hasClass">contains class</Option>
              <Option value="!hasClass">does not contain class</Option>
            </Select> ) }
          </FormItem>
        </Col>

      </Row> );
  }


}
