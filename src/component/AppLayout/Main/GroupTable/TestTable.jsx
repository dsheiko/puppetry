import React from "react";
import { Table, Icon } from "antd";
import AbstractEditableTable from "../AbstractEditableTable";
import { CommandTable } from "./TestTable/CommandTable";
import { EditableCell } from "../EditableCell";
import ErrorBoundary from "component/ErrorBoundary";
import { connectDnD } from "../DragableRow";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as selectors from "selector/selectors";

const recordPrefIcon = <Icon type="bars" title="Test case, specification of commands and assertions" />;

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        // Expanded as objects to save it
        // [ {key: "2qhk2xgp0zz", value: true}, ...]
        expanded: state.project.expanded,
        // Expanded for table
        // [ "a0wk305xfj8", ... ]
        expandedRowKeys: selectors.getProjectExpandedMemoized( state ),

        tests: selectors.getTestDataTableMemoized( state )
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
@connectDnD
export class TestTable extends AbstractEditableTable {

  whyDidYouRender = true;

  constructor( props ) {
    super( props );
    this.columns = [
      {
        title: "Test Case",
        dataIndex: "title",

        render: ( text, record ) => {
          const ref = this.registerRef( record.id, "title" );
          return (
            <EditableCell
              ref={ ref }
              prefixIcon={ recordPrefIcon }
              onSubmit={ this.onSubmit }
              className="input--title"
              record={ record }
              dataIndex="title"
              placeholder="Enter a test case name"
              model={ this.model }
              updateRecord={ this.updateRecord }
            />
          );
        } },
      this.getActionColumn()
    ];

  }

  fields = [ "title" ];

  model = "Test";

  onExpand = ( isExpanded, record ) => {
    const expanded = { ...this.props.expanded };
    expanded[ record.id ] = {
      key: record.key,
      value: isExpanded
    };
    this.props.action.setProject({
      expanded
    });
    this.props.action.autosaveProject();
  }

  renderExpandedTable = ( test ) => {
    return ( <CommandTable
      testId={ test.id }
      commands={ test.commands }
      action={ this.props.action } /> );
  }

  // selectExpanded() {
  //   const { groupId, expanded } = this.props;
  //   if ( !expanded.hasOwnProperty( groupId ) ) {
  //     return [];
  //   }
  //   return Object.values( expanded[ groupId ].tests )
  //     .filter( item => Boolean( item.value ) )
  //     .map( item => item.key );
  // }

  onRowClassName = ( record ) => {
    return `model--test${ record.disabled ? " row-disabled" : "" } ` + this.buildRowClassName( record );
  }

  /**
   * Override the abstract method to provide record array for Drag&Drop selected rows
   * @returns {Array}
   */
  getRecords() {
    return this.props.tests || [];
  }

  getExpandedRowClassName = () => "test-expanded";

  render() {
    const { tests, expandedRowKeys } = this.props;

    return (
      <ErrorBoundary>
        <Table
          className="draggable-table"
          id="cTestTable"
          components={this.components}
          onRow={this.onRow}
          rowClassName={ this.onRowClassName }
          expandedRowRender={ this.renderExpandedTable }
          expandedRowKeys={ expandedRowKeys }
          expandedRowClassName={ this.getExpandedRowClassName }
          showHeader={ false }
          dataSource={ tests }
          columns={ this.columns }
          onExpand={ this.onExpand }
          pagination={ false }

        />
      </ErrorBoundary>
    );
  }
}