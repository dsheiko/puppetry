import React from "react";
import PropTypes from "prop-types";
import { Form,  Row, Col, Select, Input } from "antd";
import If from "component/Global/If";
import { getAssertion } from "./helpers";
import AbstractComponent from "component/AbstractComponent";

const Option = Select.Option,
      FormItem = Form.Item,

      EVENT_LABELS = [
          {
            label: "Category",
            key: "category"
          },
          {
            label: "Action",
            key: "action"
          },
          {
            label: "Label",
            key: "label"
          },
          {
            label: "Value",
            key: "value"
          }
      ],

      SOCIAL_LABELS = [
          {
            label: "Network",
            key: "network"
          },
          {
            label: "Action",
            key: "action"
          },
          {
            label: "Target",
            key: "target"
          }
      ];

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

      <Row gutter={24}>

        <Col span={3} >

          <div className="ant-row ant-form-item ant-form-item--like-input">
            Assert
          </div>
        </Col>

        <Col span={4} >
          <FormItem>
            { getFieldDecorator( `assert.action`, {
              initialValue: action,
              rules: [{
                required: true
              }]
            })( <Select
              onSelect={ this.onSelectAction }>
              <Option value="pageview">Page view</Option>
              <Option value="event">Event</Option>
              <Option value="social">Social Interaction</Option>
            </Select> ) }
          </FormItem>
        </Col>

        <Col span={3} >

          <div className="ant-row ant-form-item ant-form-item--like-input"  style={{ textAlign: "left" }}>
            is tracked
          </div>
        </Col>
    </Row>


    { action === "event" ? EVENT_LABELS.map( item => (<Row gutter={24} key={ item.key }>

        <Col span={3} >
          <div className="ant-row ant-form-item ant-form-item--like-input">
            { item.label }
          </div>
        </Col>

        <Col span={4} >
          <FormItem>
            { getFieldDecorator( `assert.${ item.key }Assertion`, {
              initialValue: data[ `${ item.key }Assertion` ] || "any",
              rules: [{
                required: true
              }]
          })( <Select onSelect={ val => this.onSelectAssertion( val, `${ item.key }Assertion` ) }>
              <Option value="any">any</Option>
              <Option value="equals">equals</Option>
              <Option value="contains">contains</Option>
            </Select> ) }
          </FormItem>
        </Col>


        <Col span={12} >
          { this.getAssertion( data, item.key ) !== "any" && <FormItem>
            { getFieldDecorator( `assert.${ item.key }Value`, {
              initialValue: data[ `${ item.key }Value` ] || "",
              rules: [{
                required: true
              }]
            })(
              <Input />
            ) }
          </FormItem> }
        </Col>

      </Row> )) : null }




    { action === "social" ? SOCIAL_LABELS.map( item => (<Row gutter={24} key={ item.key }>

        <Col span={3} >
          <div className="ant-row ant-form-item ant-form-item--like-input">
            { item.label }
          </div>
        </Col>

        <Col span={4} >
          <FormItem>
            { getFieldDecorator( `assert.${ item.key }Assertion`, {
              initialValue: data[ `${ item.key }Assertion` ] || "any",
              rules: [{
                required: true
              }]
          })( <Select onSelect={ val => this.onSelectAssertion( val, `${ item.key }Assertion` ) }>
              <Option value="any">any</Option>
              <Option value="equals">equals</Option>
              <Option value="contains">contains</Option>
            </Select> ) }
          </FormItem>
        </Col>


        <Col span={12} >
          { this.getAssertion( data, item.key ) !== "any" && <FormItem>
            { getFieldDecorator( `assert.${ item.key }Value`, {
              initialValue: data[ `${ item.key }Value` ] || "",
              rules: [{
                required: true
              }]
            })(
              <Input />
            ) }
          </FormItem> }
        </Col>

      </Row> )) : null }

      </React.Fragment>);
  }
}
