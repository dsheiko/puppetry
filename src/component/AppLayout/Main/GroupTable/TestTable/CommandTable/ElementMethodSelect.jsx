import React from "react";
import { Select } from "antd";
import PropTypes from "prop-types";
import { schema, displayMethod } from "component/Schema/schema";

const Option = Select.Option;

const ElementMethodSelect = React.forwardRef(( props, ref ) => {
    const { initialValue } = props,
          onSelect = ( value ) => {
            props.changeMethod( value );
            props.setFieldsValue({ method: value });
          };
    return (
      <Select
        ref={ ref }
        showSearch
        className="select--element-method"
        defaultValue={ initialValue }
        placeholder="Select a method"
        optionFilterProp="children"
        onSelect={ onSelect }
        filterOption={( input, option ) => {
          const optNode = option.props.children,
                // <option>keyword OR <option><span className="method-title" data-keyword="keyword">
                keyword = typeof optNode === "string" ? optNode : optNode.props[ "data-keyword" ];
          return keyword
            .toLowerCase()
            .indexOf( input.toLowerCase() ) >= 0;
        }}>

        {
          Object.keys( schema.element ).map( method => ( <Option key={ method }>
            { displayMethod( "element", method ) }</Option> ) )
        }
      </Select>
    );
  });

ElementMethodSelect.propTypes = {
  changeMethod: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  initialValue: PropTypes.string.isRequired
}


export default ElementMethodSelect;