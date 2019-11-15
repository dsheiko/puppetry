import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Select, Input } from "antd";
import { getAssertion } from "./helpers";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertPosition extends React.Component {

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
          { record, targets } = this.props,
          filteredTargets = targets.map( data => data.target ),
          { position, target } = getAssertion( record );
    return (
      <React.Fragment>
        <Row gutter={24} className="is-invisible">
          <Col span={8} >
            <FormItem label="Result">
              { getFieldDecorator( "assert.assertion", {
                initialValue: "position",
                rules: [{
                  required: true
                }]
              })( <Input readOnly /> ) }
            </FormItem>
          </Col>
        </Row>


        <Row gutter={24} className="ant-form-inline">


          <div className="ant-row ant-form-item ant-form-item--like-input is-short">
            Target is
          </div>

          <FormItem>
            { getFieldDecorator( "assert.position", {
              initialValue: ( position || "above" ),
              rules: [{
                required: true
              }]
            })( <Select showSearch optionFilterProp="children" >
              <Option value="above">above</Option>
              <Option value="left">left to</Option>
              <Option value="right">right to</Option>
              <Option value="below">below</Option>
            </Select> ) }
          </FormItem>

          <FormItem>
            { getFieldDecorator( "assert.target", {
              initialValue: ( target || filteredTargets[ 0 ]),
              rules: [{
                required: true
              }]
            })( <Select showSearch optionFilterProp="children" style={{ width: 522 }}>
              { filteredTargets.map( ( t, inx ) => (
                <Option value={ t } key={ inx }>{ t }</Option>
              ) )}
            </Select> )
            }
          </FormItem>

        </Row>

      </React.Fragment> );
  }

}
