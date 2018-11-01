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
        defaultValue={ initialValue }
        placeholder="Select a target"
        optionFilterProp="children"
        onSelect={this.onSelect}
        filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
      >
        <Option value="page"><Icon type="file" /> page</Option>
        { targets.map( ( item, inx ) => ( <Option key={inx} value={ item.target }>
          <Icon type="scan" /> { item.target }
        </Option> ) ) }
      </Select>
    );
  }
}