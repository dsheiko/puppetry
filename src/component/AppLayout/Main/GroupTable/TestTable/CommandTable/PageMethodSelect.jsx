import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { schema, displayMethod } from "component/Schema/schema";

const Option = Select.Option;

export class PageMethodSelect extends React.Component {

  static propTypes = {
    changeMethod: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    initialValue: PropTypes.string.isRequired
  }

  onSelect = ( value ) => {
    this.props.changeMethod( value );
    this.props.setFieldsValue({ method: value });
  }

  static beauitifyMethod() {

  }

  render() {
    const { initialValue } = this.props;
    return (
      <Select
        showSearch
        defaultValue={ initialValue }
        placeholder="Select a method"
        optionFilterProp="children"
        onSelect={this.onSelect}
        filterOption={( input, option ) => {
          const optNode = option.props.children,
                // <option>keyword OR <option><span className="method-title" data-keyword="keyword">
                keyword = typeof optNode === "string" ? optNode : optNode.props[ "data-keyword" ];
          return keyword
            .toLowerCase()
            .indexOf( input.toLowerCase() ) >= 0;
        }}
      >
        {
          Object.keys( schema.page ).map( method => ( <Option key={ method }>
            {  displayMethod( "page", method ) }</Option> ) )
        }
      </Select>
    );
  }
}