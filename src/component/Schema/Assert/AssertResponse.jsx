
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

export class AssertResponse extends AbstractComponent {

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
          textOperator = result( this.state, "textOperator", result( assert, "textOperator", "any" ) ),
          jpOperator = result( this.state, "jpOperator", result( assert, "jpOperator", "any" ) );

    return ( <div>
      <div className="is-invisible">
        <FormItem >
          { getFieldDecorator( "assert.assertion", {
            initialValue: "response"
          })( <Input readOnly disabled /> ) }
        </FormItem>
      </div>


      <div className="command-form__noncollapsed markdown">

        <Row gutter={24} className="narrow-row">
          <Col span={ 4 /*1st*/ }>
            <div className="ant-row ant-form-item ant-form-item--like-input">
              Assert there
            </div>
          </Col>
          <Col span={4}>
            <FormItem>
              { getFieldDecorator( "assert.not", {
                initialValue: result( assert, "not", "false" ),
                rules: [{
                  required: true
                }]
              })( <Select showSearch
                optionFilterProp="children">
                <Option value="false">were</Option>
                <Option value="true">were NO</Option>
              </Select> ) }
            </FormItem>
          </Col>
          <Col span={16} >
            <div className="ant-row ant-form-item ant-form-item--like-input" style={{ "textAlign": "left" }}>
              requests like the following
            </div>
          </Col>
        </Row>

        <Row gutter={24} className="narrow-row">

          <Col span={ 4 /*1st*/ } >
            <div className="ant-row ant-form-item ant-form-item--like-input">
              Request URL like
            </div>
          </Col>

          <Col span={12} >
            <FormItem>
              { getFieldDecorator( "assert.url", {
                initialValue:  result( assert, "url", "" )
              })(
                <Input onPressEnter={ ( e ) => this.props.onPressEnter( e ) } />
              ) }
            </FormItem>
          </Col>

        </Row>

        <Row gutter={24} className="narrow-row">

          <Col span={ 4 /*1st*/ } >
            <div className="ant-row ant-form-item ant-form-item--like-input">
              Request method
            </div>
          </Col>

          <Col span={4} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.method", {
                initialValue: result( assert, "method", "GET" )
              })(
                <Select>
                  { [ "GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH" ]
                    .map( val => ( <Option key={ val } value={ val }>{ val }</Option> ) )}
                </Select>
              ) }
            </FormItem>
          </Col>

        </Row>


        <Row gutter={24} className="narrow-row">

          <Col span={ 4 /*1st*/ } >
            <div className="ant-row ant-form-item ant-form-item--like-input">
              Keyword in body
            </div>
          </Col>

          <Col span={4} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.textOperator", {
                initialValue: result( assert, "textOperator", "any" )
              })(
                <Select onSelect={ ( val ) => this.onSelect( "textOperator", val ) }>
                  <Option value="any">any</Option>
                  <Option value="matches">matches</Option>
                </Select>
              ) }
            </FormItem>
          </Col>

          <Col span={12} >
            { showInput( textOperator ) ? <FormItem>
              { getFieldDecorator( "assert.text", {
                initialValue:  result( assert, "text", "" )
              })(
                <Input onPressEnter={ ( e ) => this.props.onPressEnter( e ) } />
              ) }
            </FormItem> : null }
          </Col>

        </Row>

        <Row gutter={24} className="narrow-row">

          <Col span={ 4 /*1st*/ } >
            <div className="ant-row ant-form-item ant-form-item--like-input">
              JSONPath in body { " " }<a
                href="https://www.npmjs.com/package/jsonpath"
                onClick={ this.onExtClick }><InfoCircleOutlined /></a>
            </div>
          </Col>

          <Col span={4} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.jpOperator", {
                initialValue: result( assert, "jpOperator", "any" )
              })(
                <Select onSelect={ ( val ) => this.onSelect( "jpOperator", val ) }>
                  <Option value="any">any</Option>
                  <Option value="matches">matches</Option>
                </Select>
              ) }
            </FormItem>
          </Col>

          <Col span={8} >
            { showInput( jpOperator ) ? <FormItem>
              { getFieldDecorator( "assert.jpExp", {
                initialValue:  result( assert, "jpExp", "" )
              })(
                <Input onPressEnter={ ( e ) => this.props.onPressEnter( e ) } placeholder="$.store.book[2].price" />
              ) }
            </FormItem> : null }
          </Col>

          <Col span={8} >
            { showInput( jpOperator ) ? <FormItem>
              { getFieldDecorator( "assert.jpVal", {
                initialValue:  result( assert, "jpVal", "" )
              })(
                <Input onPressEnter={ ( e ) => this.props.onPressEnter( e ) }  placeholder="202" />
              ) }
            </FormItem> : null }
          </Col>

        </Row>

        <Row gutter={24} className="narrow-row">

          <Col span={ 4 /*1st*/ } >
            <div className="ant-row ant-form-item ant-form-item--like-input">
              Response status
              { " " } <a
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
                onClick={ this.onExtClick }><InfoCircleOutlined /></a>
            </div>
          </Col>

          <Col span={6} >
            <FormItem className="is-shrinked">
              { getFieldDecorator( "assert.status", {
                initialValue: result( assert, "status", "any" )
              })(
                <Select { ...SELECT_SEARCH_PROPS } >
                  <Option value="">any</Option>
                  {
                    statusCodes.map( val => {
                      const [ code ] = val.split( " " );
                      return ( <Option key={ val } value={ code }>{ val }</Option> );
                    })
                  }
                </Select>
              ) }
            </FormItem>
          </Col>

        </Row>

      </div>

    </div> );
  }
}
