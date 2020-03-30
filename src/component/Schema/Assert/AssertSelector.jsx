import React from "react";
import PropTypes from "prop-types";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Row, Col, Input } from "antd";
import { getAssertion } from "./helpers";

const FormItem = Form.Item;

export class AssertSelector extends React.Component {

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
          value = getAssertion( record ).value || "";
    return (
      <Row gutter={24}>

        <Col className="is-hidden" >
          <FormItem className="is-hidden">
            { getFieldDecorator( "assert.assertion", {
              initialValue: "selector"
            })( <Input disabled />  ) }
          </FormItem>
        </Col>

        <Col>
          <FormItem label="Selector or pseudo-selector to match">
            { getFieldDecorator( "assert.value", {
              initialValue: value,

              rules: [{
                required: true
              }]
            })( <Input placeholder="e.g. :invalid or :not(:empty)"
              onPressEnter={ ( e ) => this.props.onPressEnter( e ) } /> )
            }
          </FormItem>
        </Col>

      </Row> );
  }

}
