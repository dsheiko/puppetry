import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Input } from "antd";
import { getAssertion } from "./helpers";

const FormItem = Form.Item;

export class AssertScreenshot extends React.Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    onPressEnter: PropTypes.func.isRequired,
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
          value = getAssertion( record ).value || "0.2";
    return (
      <Row gutter={24}>

        <Col className="is-hidden" >
          <FormItem className="is-hidden">
            { getFieldDecorator( "assert.assertion", {
              initialValue: "screenshot"
            })( <Input disabled />  ) }
          </FormItem>
        </Col>

        <Col span={4} >
          <FormItem label="Expected mismatch tolerance ratio (0..1)">
            { getFieldDecorator( "assert.mismatchTolerance", {
              initialValue: value,
              rules: [{
                required: true
              }]
            })( <Input placeholder="e.g. 0.2" onPressEnter={ ( e ) => this.props.onPressEnter( e ) } /> )
            }
          </FormItem>
        </Col>

      </Row> );
  }

}
