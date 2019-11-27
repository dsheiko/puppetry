import React from "react";
import { Form, Input, Select, Icon } from "antd";
import { AbstractEditableCell } from "./AbstractEditableCell";
import Tooltip from "component/Global/Tooltip";
import { ruleValidateNotEmptyString } from "service/utils";
import { getActiveTargets } from "selector/selectors";
import { SELECT_SEARCH_PROPS } from "service/utils";

const FormItem = Form.Item,
      { Option } = Select,
      connectForm = Form.create();

@connectForm
export class TargetSelectorCell extends AbstractEditableCell {

  onChangeType = ( val ) => {
    this.setState({ ref: val });
  }

  getLabel = ( desc, tooltip ) => (
    <span>
      { desc }
      <Tooltip
        title={ tooltip }
        icon="question-circle"
        pos="up-left"
      />
    </span>
  )


  render() {
    const { placeholder, dataIndex, record, prefixIcon, className, type, targets } = this.props,
          { getFieldDecorator } = this.props.form,
          { editing } = record,
          inputOtherProps = type ? { type } : {},
          value = record[ dataIndex ],
          ref = this.state.hasOwnProperty( "ref" ) ? this.state.ref : record.ref,
          activeTargets = getActiveTargets( targets ).filter( target => target.target !== record.target );

    return (
      <div className="editable-cell">
        {
          editing ? (
            <Form className="cell-form">
              <FormItem>
                { getFieldDecorator( dataIndex, {
                  initialValue: value,
                  rules: [
                    {
                      validator: ruleValidateNotEmptyString
                    },
                    {
                      transform: ( value ) => value.trim()
                    }
                  ]
                })(
                  <Input
                    { ...inputOtherProps }
                    prefix={ prefixIcon || null }
                    className={ className || null }
                    onKeyPress={ ( e ) => this.onKeyPress( e, record ) }
                    onKeyDown={ ( e ) => this.onKeyDown( e, record ) }
                    placeholder={placeholder}
                    tabIndex={ dataIndex === "select" ? 2 : 1 }
                  />
                )}

              </FormItem>

              { activeTargets.length ? <details>
                <summary>Options</summary>
                <div className="target-options">

                  <FormItem label="Parent target">
                    { getFieldDecorator( "ref", {
                      initialValue: ( record.ref || "" )
                    })(
                      <Select onChange={ this.onChangeType } { ...SELECT_SEARCH_PROPS }>
                        <Option key="0" value="">document</Option>
                        { activeTargets.map( target => ( <Option
                          key={ target.target }
                          value={ target.target }>
                          { target.target }</Option> ) ) }
                      </Select>
                    )}

                  </FormItem>

                  { ref ? <FormItem label="Parent type">
                    { getFieldDecorator( "parentType", {
                      initialValue: ( record.parentType || "" )
                    })(
                      <Select { ...SELECT_SEARCH_PROPS }>
                        <Option key="0" value="">generic element</Option>
                        <Option key="1" value="shadowHost">shadow host</Option>
                        <Option key="2" value="iframe">inline frame</Option>
                      </Select>
                    )}

                  </FormItem> : null }

                </div>
              </details> : null }

            </Form>
          ) : (
            <div className="container--editable-cell">
              { prefixIcon || null }
              { record.ref ? <span className="target-ref"><Icon type="apartment" />{ record.ref } </span> : null }
              { this.normalizeValue( value, type ) }
            </div>
          )
        }
      </div>
    );
  }
}