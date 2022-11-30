import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { schema, displayMethod } from "component/Schema/schema";

const Option = Select.Option;

const PageMethodSelect = React.forwardRef(( props, ref ) => {
    const { initialValue } = props,
          onSelect = ( value ) => {
            props.changeMethod( value );
            props.setFieldsValue({ method: value });
          };
    return (
      <Select
        ref={ ref }
        showSearch
        className="select--page-method"
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
        }}
      >
        {
          Object.keys( schema.page ).map( method => ( <Option key={ method }>
            {  displayMethod( "page", method ) }</Option> ) )
        }
      </Select>
    );
});

PageMethodSelect.propTypes = {
  changeMethod: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  initialValue: PropTypes.string.isRequired
}


export default PageMethodSelect;