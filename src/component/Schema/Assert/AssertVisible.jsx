/*eslint react/no-unescaped-entities: 0*/
import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Checkbox, Select, Row, Col, Icon } from "antd";
import { getAssertion } from "./helpers";
import { result } from "service/utils";
import AbstractComponent from "component/AbstractComponent";

const FormItem = Form.Item,
      { Option } = Select;

export class AssertVisible extends AbstractComponent {

  static propTypes = {
    record: PropTypes.object.isRequired,
    targets: PropTypes.arrayOf( PropTypes.object ),
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  state = {
    available: true
  }

  onChangeAvailable = ( e ) => {
    this.setState({ available: e.target.checked });
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record } = this.props,
          assert = getAssertion( record ),
          available = result( assert, "value", this.state.available );

    return ( <div>
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
          { getFieldDecorator( "assert.value", {
            initialValue: result( assert, "value", true ),
            valuePropName: "checked"
          })(
            <Checkbox onChange={ this.onChangeAvailable }> is available (currently exists in the <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction"
              onClick={ this.onExtClick }>DOM</a>)</Checkbox>
          ) }
        </FormItem>


        <Row gutter={24} className="narrow-row">

          <Col span={3} >
            <div className="ant-row ant-form-item ant-form-item--like-input">
            display
              { " " } <a
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/display"
                onClick={ this.onExtClick }><Icon type="info-circle" /></a>
            </div>
          </Col>

          <Col span={4} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.display", {
                initialValue: result( assert, "display", "any" )
              })(
                <Select disabled={ !available }>
                  <Option value="any">any</Option>
                  <Option value="not">NOT none</Option>
                  <Option value="none">none</Option>
                </Select>
              ) }
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24} className="narrow-row">

          <Col span={3} >
            <div className="ant-row ant-form-item ant-form-item--like-input">
            visibility
              { " " } <a
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/visibility"
                onClick={ this.onExtClick }><Icon type="info-circle" /></a>
            </div>
          </Col>
          <Col span={4} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.visibility", {
                initialValue: result( assert, "visibility", "any" )
              })(
                <Select disabled={ !available }>
                  <Option value="any">any</Option>
                  <Option value="not">NOT hidden</Option>
                  <Option value="hidden">hidden</Option>
                </Select>
              ) }
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24} className="narrow-row">

          <Col span={3} >
            <div className="ant-row ant-form-item ant-form-item--like-input">
            opacity
              { " " } <a
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/opacity"
                onClick={ this.onExtClick }><Icon type="info-circle" /></a>
            </div>
          </Col>
          <Col span={4} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.opacity", {
                initialValue: result( assert, "opacity", "any" )
              })(
                <Select disabled={ !available }>
                  <Option value="any">any</Option>
                  <Option value="not">NOT 0</Option>
                  <Option value="0">0</Option>
                </Select>
              ) }
            </FormItem>
          </Col>
        </Row>

        <FormItem className="is-shrinked">
          { getFieldDecorator( "assert.isIntersecting", {
            initialValue: result( assert, "isIntersecting", false ),
            valuePropName: "checked"
          })(
            <Checkbox disabled={ !available }> is within the current viewport</Checkbox>
          ) }
        </FormItem>

      </div>

    </div> );
  }
}
