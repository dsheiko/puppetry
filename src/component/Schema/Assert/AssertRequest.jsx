/*eslint react/no-unescaped-entities: 0*/
import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Select, Row, Col } from "antd";
import { getAssertion } from "./helpers";
import { result, SELECT_SEARCH_PROPS } from "service/utils";
import AbstractComponent from "component/AbstractComponent";
import statusCodes from "service/statusCodes";
import { InfoCircleOutlined } from "@ant-design/icons";

const FormItem = Form.Item,
      { Option } = Select;

function showInput( val ) {
  return val !== "any" && val !== "empty" && val !== "!empty";
}

function renderOperator( assert, name, getFieldDecorator, onSelect ) {
  return ( <FormItem className="is-shrinked">
    { getFieldDecorator( `assert.${ name }`, {
      initialValue: result( assert, name, "any" )
    })(
      <Select onSelect={ ( val ) => onSelect( name, val ) }>
        <Option value="any">any</Option>
        <Option value="equals">equals</Option>
        <Option value="contains">contains</Option>
        <Option value="empty">is empty</Option>
        <Option value="!equals">does not equal</Option>
        <Option value="!contains">does not contain</Option>
        <Option value="!empty">is not empty</Option>
      </Select>
    ) }
  </FormItem> );
}

export class AssertRequest extends AbstractComponent {

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

  onSelect = ( field, val ) => {
    this.setState({ [ field ]: val });
  }


  render () {
    const { getFieldDecorator } = this.props.form,
          { record } = this.props,
          assert = getAssertion( record ),
          layout = {
            labelCol: {
              span: 4
            },
            wrapperCol: {
              span: 12
            }
          },
          textOperator = result( this.state, "textOperator", result( assert, "textOperator", "any" ) ),
          headerOperator = result( this.state, "headerOperator", result( assert, "headerOperator", "any" ) ),
          statusOperator = result( this.state, "statusOperator", result( assert, "statusOperator", "any" ) );

    return ( <div>
      <div className="is-invisible">
        <FormItem >
          { getFieldDecorator( "assert.assertion", {
            initialValue: "request"
          })( <Input readOnly disabled /> ) }
        </FormItem>
      </div>

      <div className="command-form__noncollapsed markdown">


        <Row gutter={24} className="narrow-row">

          <Col span={3} >
            <div className="ant-row ant-form-item ant-form-item--like-input">
              Status code
              { " " } <a
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
                onClick={ this.onExtClick }><InfoCircleOutlined /></a>
            </div>
          </Col>

          <Col span={4} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.statusOperator", {
                initialValue: result( assert, "statusOperator", "any" )
              })(
                <Select onSelect={ ( val ) => this.onSelect( "statusOperator", val ) }>
                  <Option value="any">any</Option>
                  <Option value="equals">equals</Option>
                  <Option value="!equals">does not equal</Option>
                </Select>
              ) }
            </FormItem>
          </Col>


          <Col span={6} >
            { showInput( statusOperator ) ? <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.statusValue", {
                initialValue:  result( assert, "statusValue", "" )
              })(
                <Select { ...SELECT_SEARCH_PROPS }>
                  <Option value="">any</Option>
                  {
                    statusCodes.map( val => {
                      const [ code ] = val.split( " " );
                      return ( <Option key={ val } value={ code }>{ val }</Option> );
                    })
                  }
                </Select>
              ) }
            </FormItem> : null }
          </Col>

        </Row>


        <Row gutter={24} className="narrow-row">

          <Col span={3} >
            <div className="ant-row ant-form-item ant-form-item--like-input">
              Data (text)
              { " " } <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText"
                onClick={ this.onExtClick }><InfoCircleOutlined /></a>
            </div>
          </Col>

          <Col span={4} >
            {  renderOperator( assert, "textOperator", getFieldDecorator, this.onSelect ) }
          </Col>


          <Col span={12} >
            { showInput( textOperator ) ? <FormItem>
              { getFieldDecorator( "assert.textValue", {
                initialValue:  result( assert, "textValue", "" )
              })(
                <Input onPressEnter={ ( e ) => this.props.onPressEnter( e ) } />
              ) }
            </FormItem> : null }
          </Col>

        </Row>

        <Row gutter={24} className="narrow-row">

          <Col span={3} >
            <div className="ant-row ant-form-item ant-form-item--like-input">
              has header
              { " " } <a
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers"
                onClick={ this.onExtClick }><InfoCircleOutlined /></a>
            </div>
          </Col>

          <Col span={4} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.headerOperator", {
                initialValue: result( assert, "headerOperator", "any" )
              })(
                <Select onSelect={ ( val ) => this.onSelect( "headerOperator", val ) }>
                  <Option value="any">any</Option>
                  <Option value="specific">specific</Option>
                </Select>
              ) }
            </FormItem>
          </Col>

        </Row>

        { showInput( headerOperator ) ? <Row gutter={24} className="narrow-row">
          <Col span={3} >
          </Col>
          <Col span={12} >
            <FormItem { ...layout } label="with name">
              { getFieldDecorator( "assert.headerName", {
                initialValue: result( assert, "headerName", "" )
              })(
                <Input onPressEnter={ ( e ) => this.props.onPressEnter( e ) } />
              ) }
            </FormItem>
            <FormItem { ...layout } label="with value">
              { getFieldDecorator( "assert.headerValue", {
                initialValue: result( assert, "headerValue", "" )
              })(
                <Input onPressEnter={ ( e ) => this.props.onPressEnter( e ) } />
              ) }
            </FormItem>
          </Col>
        </Row> : null }


      </div>

    </div> );
  }
}
