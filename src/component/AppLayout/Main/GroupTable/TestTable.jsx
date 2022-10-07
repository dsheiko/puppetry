import React from "react";
import { Table, Icon } from "antd";
import AbstractEditableTable from "../AbstractEditableTable";
import { CommandTable } from "./TestTable/CommandTable";
import { EditableCell } from "../EditableCell";
import ErrorBoundary from "component/ErrorBoundary";
import { connectDnD } from "../DragableRow";

const recordPrefIcon = <Icon type="bars" title="Test case, specification of commands and assertions" />;

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
    expanded[ record.groupId ].tests[ record.id ] = {
      key: record.key,
      value: isExpanded
    };
    this.props.action.setProject({
      groups: expanded
    });
    this.props.action.autosaveProject();
  }

  renderExpandedTable = ( test ) => {
    const targets = this.props.targets;
    return ( <CommandTable
      targets={ targets }
      testId={ test.id }
      selector={ this.props.selector }
      groupId={ test.groupId }
      action={ this.props.action } /> );
  }

  selectExpanded() {
    const { groupId, expanded } = this.props;
    if ( !expanded.hasOwnProperty( groupId ) ) {
      return [];
    }
    return Object.values( expanded[ groupId ].tests )
      .filter( item => Boolean( item.value ) )
      .map( item => item.key );
  }

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

  render() {
    const { tests } = this.props,
          expanded = this.selectExpanded();

    return (
      <ErrorBoundary>
        <Table
          className="draggable-table"
          id="cTestTable"
          components={this.components}
          onRow={this.onRow}
          rowClassName={ this.onRowClassName }
          expandedRowRender={ this.renderExpandedTable }
          expandedRowKeys={ expanded }
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