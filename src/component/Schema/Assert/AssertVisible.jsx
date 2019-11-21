/*eslint react/no-unescaped-entities: 0*/
import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Select, Row, Col, Icon } from "antd";
import { getAssertion } from "./helpers";
import { result } from "service/utils";
import { migrateAssertVisible } from "service/suite";
import AbstractComponent from "component/AbstractComponent";

const FormItem = Form.Item,
      { Option } = Select;

export class AssertVisible extends AbstractComponent {

  static propTypes = {
    record: PropTypes.object.isRequired,
    onPressEnter: PropTypes.func.isRequired,
    targets: PropTypes.arrayOf( PropTypes.object ),
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  state = {
  }

  onChangeAvailable = ( availability ) => {
    this.setState({ availability });
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record } = this.props,
          command = migrateAssertVisible( record ),
          assert = getAssertion( command ),
          availability = result( this.state, "availability", assert.availability ) || "visible",
          available = availability === "available";

    return ( <div>
      <div className="is-invisible">
        <FormItem >
          { getFieldDecorator( "assert.assertion", {
            initialValue: "visible"
          })( <Input readOnly disabled /> ) }
        </FormItem>
      </div>

      <div className="command-form__noncollapsed markdown">


        <Row gutter={24} className="narrow-row">

          <Col span={3} >
            <div className="ant-row ant-form-item ant-form-item--like-input">
            The target is

            </div>
          </Col>

          <Col span={8} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.availability", {
                initialValue: result( assert, "availability", "visible" )
              })(
                <Select onChange={ this.onChangeAvailable }>
                  <Option value="visible">available on the page and observable</Option>
                  <Option value="available">available on the page</Option>
                  <Option value="invisible">available, but NOT observable</Option>
                  <Option value="unavailable">NOT available on the page</Option>

                </Select>
              ) }

              <div className="template-helper">
                { availability === "visible" && <span>The target is available in the DOM and
            visible to the user (displayed, visible, opaque, within the viewport)</span> }
                { availability === "available" && <span>The target is available in the DOM.
            Use the options below to assert the visibility</span> }
                { availability === "invisible" && <span>The target is available in the DOM,
            not not visible to the user (display: none or visibility: hidden or opacity:
            0 or out of the viewport)</span> }
                { availability === "unavailable" && <span>The target is not available in the DOM</span> }

              </div>
            </FormItem>
          </Col>
        </Row>


        <Row gutter={24} className="narrow-row">

          <Col span={3} >
            <div className="ant-row ant-form-item ant-form-item--like-input">
            CSS display
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
            CSS visibility
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
            CSS opacity
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


        <Row gutter={24} className="narrow-row">

          <Col span={3} >
            <div className="ant-row ant-form-item ant-form-item--like-input">
            offset
              { " " } <a
                href="https://pptr.dev/#?product=Puppeteer&version=v2.0.0&show=api-elementhandleisintersectingviewport"
                onClick={ this.onExtClick }><Icon type="info-circle" /></a>
            </div>
          </Col>
          <Col span={4} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.isIntersecting", {
                initialValue: result( assert, "isIntersecting", "any" )
              })(
                <Select disabled={ !available }>
                  <Option value="any">any</Option>
                  <Option value="true">within the viewport</Option>
                  <Option value="false">out of the viewport</Option>
                </Select>
              ) }
            </FormItem>
          </Col>
        </Row>


      </div>

    </div> );
  }
}
