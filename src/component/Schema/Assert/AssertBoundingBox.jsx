import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Select, Input, InputNumber } from "antd";
import { getAssertion } from "./helpers";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertBoundingBox extends React.Component {

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


  state = {
    x: "any",
    y: "any",
    w: "any",
    h: "any"
  }

  onSwitchChange( value, param ) {
    this.setState({
      [ param ]: value
    });
  }

  componentDidMount() {
    const { hOperator, wOperator, xOperator, yOperator } = getAssertion( this.props.record );
    this.setState({
      x: xOperator || "any",
      y: yOperator || "any",
      w: wOperator || "any",
      h: hOperator || "any"
    });
  }


  render () {
    const { getFieldDecorator } = this.props.form,
          { record } = this.props,
          state = this.state,
          { hOperator, hValue, wOperator, wValue, xOperator, xValue, yOperator, yValue } = getAssertion( record );

    return (
      <React.Fragment>
        <FormItem label="Result" classdName="is-hidden">
          { getFieldDecorator( "assert.assertion", {
            initialValue: "boundingBox",
            rules: [{
              required: true
            }]
          })( <Input readOnly /> ) }
        </FormItem>


        <Row className="ant-form-inline">

          <div className="ant-row ant-form-item ant-form-item--like-input is-short">
            <b>x</b> is
          </div>

          <FormItem>
            { getFieldDecorator( "assert.xOperator", {
              initialValue: xOperator || "any",
              rules: [{
                required: true
              }]
            })( <Select showSearch optionFilterProp="children" style={{ width: 64 }}
              onChange={ ( e ) =>  this.onSwitchChange( e, "x" ) }>
              <Option value="any">any</Option>
              <Option value="eq">=</Option>
              <Option value="gt">&gt;</Option>
              <Option value="lt">&lt;</Option>
            </Select> ) }
          </FormItem>


          { state.x !== "any" && <FormItem>
            { getFieldDecorator( "assert.xValue", {
              initialValue: xValue,
              rules: [{
                required: true
              }]
            })( <InputNumber onPressEnter={ ( e ) => this.props.onPressEnter( e ) } /> )
            }
          </FormItem> }

          { state.x !== "any" && <div
            className="ant-row ant-form-item ant-form-item--like-input is-short is-text-align-left">px</div> }

        </Row>

        <Row className="ant-form-inline">

          <div className="ant-row ant-form-item ant-form-item--like-input is-short">
            <b>y</b> is
          </div>

          <FormItem>
            { getFieldDecorator( "assert.yOperator", {
              initialValue: yOperator || "any",
              rules: [{
                required: true
              }]
            })( <Select showSearch optionFilterProp="children" style={{ width: 64 }}
              onChange={ ( e ) =>  this.onSwitchChange( e, "y" ) }>
              <Option value="any">any</Option>
              <Option value="eq">=</Option>
              <Option value="gt">&gt;</Option>
              <Option value="lt">&lt;</Option>
            </Select> ) }
          </FormItem>

          { state.y !== "any" && <FormItem>
            { getFieldDecorator( "assert.yValue", {
              initialValue: yValue,
              rules: [{
                required: true
              }]
            })( <InputNumber onPressEnter={ ( e ) => this.props.onPressEnter( e ) } /> )
            }
          </FormItem> }

          { state.y !== "any" && <div
            className="ant-row ant-form-item ant-form-item--like-input is-short is-text-align-left">px</div> }

        </Row>

        <Row className="ant-form-inline">

          <div className="ant-row ant-form-item ant-form-item--like-input is-short">
            <b>width</b> is
          </div>

          <FormItem>
            { getFieldDecorator( "assert.wOperator", {
              initialValue: wOperator || "any",
              rules: [{
                required: true
              }]
            })( <Select showSearch optionFilterProp="children" style={{ width: 64 }}
              onChange={ ( e ) =>  this.onSwitchChange( e, "w" ) }>
              <Option value="any">any</Option>
              <Option value="eq">=</Option>
              <Option value="gt">&gt;</Option>
              <Option value="lt">&lt;</Option>
            </Select> ) }
          </FormItem>

          { state.w !== "any" && <FormItem>
            { getFieldDecorator( "assert.wValue", {
              initialValue: wValue,
              rules: [{
                required: true
              }]
            })( <InputNumber onPressEnter={ ( e ) => this.props.onPressEnter( e ) } /> )
            }
          </FormItem> }

          { state.w !== "any" && <div
            className="ant-row ant-form-item ant-form-item--like-input is-short is-text-align-left">px</div> }

        </Row>

        <Row className="ant-form-inline">

          <div className="ant-row ant-form-item ant-form-item--like-input is-short">
            <b>height</b> is
          </div>

          <FormItem>
            { getFieldDecorator( "assert.hOperator", {
              initialValue: hOperator || "any",
              rules: [{
                required: true
              }]
            })( <Select showSearch optionFilterProp="children" style={{ width: 64 }}
              onChange={ ( e ) =>  this.onSwitchChange( e, "h" ) }>
              <Option value="any">any</Option>
              <Option value="eq">=</Option>
              <Option value="gt">&gt;</Option>
              <Option value="lt">&lt;</Option>
            </Select> ) }
          </FormItem>

          { state.h !== "any" && <FormItem>
            { getFieldDecorator( "assert.hValue", {
              initialValue: hValue,
              rules: [{
                required: true
              }]
            })( <InputNumber onPressEnter={ ( e ) => this.props.onPressEnter( e ) } /> )
            }
          </FormItem> }

          { state.h !== "any" && <div
            className="ant-row ant-form-item ant-form-item--like-input is-short is-text-align-left">px</div> }

        </Row>


      </React.Fragment> );
  }

}
