import React from "react";
import PropTypes from "prop-types";
import { Icon, Select } from "antd";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        suiteTargets: state.suite.targets,
        sharedTargets: state.project.targets,
        pageDataTable: selectors.getSuitePageDataTableMemoized( state )
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      }),
      Option = Select.Option;

@connect( mapStateToProps, mapDispatchToProps )
export class PageSelect extends React.Component {


  onSelect = ( value ) => {
    this.props.setFieldsValue({ page: value });
  }

  render() {
    const { pageDataTable, initialValue } = this.props,
          names = pageDataTable.map( item => item.name ).filter( name => Boolean( name ) );

    return (
      <Select
        showSearch
        className="select--page"
        defaultValue={ initialValue }
        placeholder="Select a page"
        optionFilterProp="children"
        onSelect={this.onSelect}
        filterOption={( input, option ) => {
          const optNode = option.props.children,
                keyword = typeof optNode === "string" ? optNode : optNode.props[ "data-keyword" ];
          return keyword
            .toLowerCase()
            .indexOf( input.toLowerCase() ) >= 0;
        }}>
        <Option value="main"><span data-keyword="page">main</span></Option>

        { names
          .map( ( name, inx ) => ( <Option key={inx} value={ name }>
            <span data-keyword={ name }>{ name }</span>
          </Option> ) ) }

      </Select>
    );
  }
}