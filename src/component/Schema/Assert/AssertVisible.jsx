import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Input, Checkbox } from "antd";
import { getAssertion } from "./helpers";
import { result } from "service/utils";

const FormItem = Form.Item;

export class AssertVisible extends React.Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    targets: PropTypes.arrayOf( PropTypes.object ),
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record, options } = this.props,
          assert = getAssertion( record );

    return (<div>
      <div className="is-invisible">
        <FormItem >
          { getFieldDecorator( "assert.assertion", {
            initialValue: "visible"
          })( <Input readOnly disabled /> ) }
        </FormItem>
      </div>
      <div>Target element:</div>
      <div className="command-form__noncollapsed markdown">
          <FormItem className="is-shrinked">
            { getFieldDecorator( "assert.isDisplayed", {
              initialValue: true,
              valuePropName: ( result( assert, "isDisplayed", true ) ? "checked" : "data-ok" )
            })(
              <Checkbox> is displayed (display isn't <code>none</code>)</Checkbox>
            ) }
          </FormItem>

           <FormItem className="is-shrinked">
            { getFieldDecorator( "assert.isVisible", {
              initialValue: true,
              valuePropName: ( result( assert, "isVisible", true ) ? "checked" : "data-ok" )
            })(
              <Checkbox> is visible (visibility isn't <code>hidden</code>)</Checkbox>
            ) }
          </FormItem>

          <FormItem className="is-shrinked">
            { getFieldDecorator( "assert.isOpaque", {
              initialValue: true,
              valuePropName: ( result( assert, "isOpaque", true ) ? "checked" : "data-ok" )
            })(
              <Checkbox> is opaque (opacity isn't <code>0</code>)</Checkbox>
            ) }
          </FormItem>

          <FormItem className="is-shrinked">
            { getFieldDecorator( "assert.isIntersecting", {
              initialValue: true,
              valuePropName: ( result( assert, "isIntersecting", true ) ? "checked" : "data-ok" )
            })(
              <Checkbox> is within the current viewport</Checkbox>
            ) }
          </FormItem>

      </div>
      </div> );
  }
}
