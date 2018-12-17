import React from "react";
import PropTypes from "prop-types";
import { Icon, Select } from "antd";
const Option = Select.Option;


export class TargetSelect extends React.Component {

  static propTypes = {
    targets: PropTypes.array.isRequired,
    changeTarget: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    initialValue: PropTypes.string.isRequired
  }

  onSelect = ( value ) => {
    this.props.changeTarget( value );
    this.props.setFieldsValue({ target: value });
  }

  render() {
    const { targets, initialValue } = this.props;
    return (
      <Select
        showSearch
        className="select--target"
        defaultValue={ initialValue }
        placeholder="Select a target"
        optionFilterProp="children"
        onSelect={this.onSelect}
        filterOption={( input, option ) => {
          const optNode = option.props.children,
                // <option>keyword OR <option><span className="method-title" data-keyword="keyword">
                keyword = typeof optNode === "string" ? optNode : optNode.props[ "data-keyword" ];
          return keyword
            .toLowerCase()
            .indexOf( input.toLowerCase() ) >= 0;
        }}>
        <Option value="page"><span data-keyword="page"><Icon type="file" /> page</span></Option>
        { targets.map( ( item, inx ) => ( <Option key={inx} value={ item.target }>
          <span data-keyword={ item.target }><Icon type="scan" /> { item.target }</span>
        </Option> ) ) }
      </Select>
    );
  }
}