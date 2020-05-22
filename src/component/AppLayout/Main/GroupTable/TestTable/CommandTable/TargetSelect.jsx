import React from "react";
import PropTypes from "prop-types";
import { Icon, Select } from "antd";
import { connect } from "react-redux";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        suiteTargets: state.suite.targets,
        sharedTargets: state.project.targets
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      }),
      Option = Select.Option;

@connect( mapStateToProps, mapDispatchToProps )
export class TargetSelect extends React.Component {

  static propTypes = {
    suiteTargets: PropTypes.object,
    sharedTargets: PropTypes.object,
    changeTarget: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    initialValue: PropTypes.string
  }

  onSelect = ( value ) => {
    this.props.changeTarget( value );
    this.props.setFieldsValue({ target: value });
  }

  render() {
    const { suiteTargets, sharedTargets, initialValue } = this.props,
          targets = Object.values({ ...sharedTargets, ...suiteTargets });
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
        { targets
          .filter( item => item.target )
          .map( ( item, inx ) => ( <Option key={inx} value={ item.target }>
            <span data-keyword={ item.target }><Icon type="scan" /> { item.target }</span>
          </Option> ) ) }
      </Select>
    );
  }
}