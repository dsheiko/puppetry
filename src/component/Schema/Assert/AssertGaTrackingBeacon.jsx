import React from "react";
import PropTypes from "prop-types";
import { Form,  Row, Col, Select, Input, InputNumber, Checkbox } from "antd";
import If from "component/Global/If";
import { getAssertion } from "./helpers";
import AbstractComponent from "component/AbstractComponent";
import Tooltip from "component/Global/Tooltip";
import LearnMore from "component/Global/LearnMore";
import LABELS from "./gaSchema";

const { Option, OptGroup } = Select,
      FormItem = Form.Item,

      getLabel = ( desc, tooltip ) => (
      <span>
        { desc }
        <Tooltip
          title={ tooltip }
          icon="question-circle"
          pos="up-left"
        />
      </span>
    );

export class AssertGaTrackingBeacon extends AbstractComponent {

  state = {
    action: null,
    assertion: "",
    type: ""
  }

  static propTypes = {
    record: PropTypes.object.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  onSelectAction = ( value ) => {
    this.setState({
      action: value
    });
  }

  onSelectAssertion = ( value, field ) => {
    this.setState({
      [ field ]: value
    });
  }

  getAssertion( data, key ) {
    return this.state[ `${ key }Assertion` ] ||  ( data[ `${ key }Assertion` ] || "any" );
  }


  render () {
    const { getFieldDecorator } = this.props.form,
          { record } = this.props,
          data = getAssertion( record ),
          action = this.state.action || ( data.action || "pageview" );



    return (<React.Fragment>

       <div className="is-invisible">
          <FormItem>
            { getFieldDecorator( "assert.assertion", {
              initialValue: "assertGaTracking"
            })( <Input readOnly /> ) }
          </FormItem>
      </div>

      <Row gutter={24} className="narrow-row">

        <Col span={3} >

          <div className="ant-row ant-form-item ant-form-item--like-input">
            Measurement
          </div>
        </Col>

        <Col span={6} >
          <FormItem>
            { getFieldDecorator( `assert.action`, {
              initialValue: action,
              rules: [{
                required: true
              }]
            })( <Select
              onSelect={ this.onSelectAction }>
              <OptGroup label="Common">
                <Option value="pageview">Page view</Option>
                <Option value="event">Event</Option>
                <Option value="social">Social Interaction</Option>
                <Option value="screen">App / Screen</Option>
                <Option value="timing">User Timings</Option>
                <Option value="exception">Exception</Option>
              </OptGroup>
              <OptGroup label="Ecommerce Plugin">
                <Option value="ecommerceAddItem">Adding an Item</Option>
                <Option value="ecommerceAddTransaction">Adding a Transaction</Option>
              </OptGroup>
              <OptGroup label="Enhanced Ecommerce Plugin">
                <Option value="ecProductImpression">Product Impression</Option>
                <Option value="ecProductClick">Product Click</Option>
                <Option value="ecProductDetails">Product Details View</Option>
                <Option value="ecAddToCart">Addition to Cart</Option>
                <Option value="ecRemoveFromCart">Remove from Cart</Option>
                <Option value="ecCheckout">Checkout Process</Option>
                <Option value="ecRefund">Refund</Option>
                <Option value="ecPurchase">Purchase</Option>
                <Option value="ecPromotion">Internal Promotion</Option>
              </OptGroup>

            </Select> ) }
          </FormItem>
        </Col>

        <Col span={3} >
        </Col>
    </Row>

    { action in LABELS ? <div>
        <Row gutter={24}>
          <Col span={3} >
          </Col>
          <Col span={21} >
          <p>{ LABELS[ action ].description } <nobr><a href={ LABELS[ action ].link }
          onClick={ this.onExtClick }>Learn more...</a></nobr>
          </p>
          </Col>
        </Row>
        {  LABELS[ action ].fields.map( item => (<Row gutter={24} key={ item.key }>

        <Col span={3} >
          <div className="ant-row ant-form-item ant-form-item--like-input">
            { item.tooltip ? getLabel( item.label, item.tooltip ) : item.label }
          </div>
        </Col>

        { item.input === "CHECKBOX" && <Col span={4} ><FormItem>
            { getFieldDecorator( `assert.${ item.key }Value`, {
              initialValue: true,
              valuePropName: ( data[ `${ item.key }Value` ] ===  true ? "checked" : "data-ok" )
            })(
              <Checkbox></Checkbox>
            ) }
          </FormItem></Col>  }

        { item.input !== "CHECKBOX" && <Col span={4} >
          <FormItem>
            { getFieldDecorator( `assert.${ item.key }Assertion`, {
              initialValue: data[ `${ item.key }Assertion` ] || "any",
              rules: [{
                required: true
              }]
          })( <Select showSearch optionFilterProp="children" onSelect={ val => this.onSelectAssertion( val, `${ item.key }Assertion` ) }>
              <Option value="any">any</Option>
              <Option value="equals">equals</Option>
              { item.input !== "NUMBER" ? <Option value="contains">contains</Option> : null }
            </Select> ) }
          </FormItem>
        </Col> }

        { item.input !== "CHECKBOX" && <Col span={12} >
          { this.getAssertion( data, item.key ) !== "any" && <FormItem>
            { getFieldDecorator( `assert.${ item.key }Value`, {
              initialValue: data[ `${ item.key }Value` ] || "",
              rules: [{
                required: true
              }]
            })(
              item.input === "NUMBER" ? <InputNumber /> : <Input />
            ) }
          </FormItem> }
        </Col> }

      </Row> ))
    }</div> : null }

      </React.Fragment>);
  }
}
