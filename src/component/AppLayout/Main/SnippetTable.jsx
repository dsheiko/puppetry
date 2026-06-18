import React from "react";
import { Table, Icon } from "antd";
import AbstractEditableTable from "./AbstractEditableTable";
import { CommandTable } from "./TestTable/CommandTable";
import { EditableCell } from "./EditableCell";
import ErrorBoundary from "component/ErrorBoundary";
import { connectDnD } from "./DragableRow";

const recordPrefIcon = <Icon type="snippets" title="Shared Flow" />;

@connectDnD
export class SnippetTable extends AbstractEditableTable {

  constructor( props ) {
    super( props );
    this.columns = [
      {
        title: "Shared Flow",
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
              placeholder="Enter a shared flow name"
              model={ this.model }
              updateRecord={ this.updateRecord }
            />
          );
        }
      },
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
      tests: expanded
    });
    this.props.action.autosaveProject();
  }

  renderExpandedTable = ( test ) => {
    return ( <CommandTable
      targets={ this.props.targets }
      testId={ test.id }
      selector={ this.props.selector }
      snippets={ true }
      action={ this.props.action } /> );
  }

  selectExpanded() {
    const { expanded } = this.props;
    return Object.values( expanded || {})
      .filter( item => Boolean( item.value ) )
      .map( item => item.key );
  }

  onRowClassName = ( record ) => {
    return `model--test${ record.disabled ? " row-disabled" : "" } ` + this.buildRowClassName( record );
  }

  getRecords() {
    return this.props.tests;
  }

  render() {
    const { tests } = this.props,
          expanded = this.selectExpanded();
    return (
      <ErrorBoundary>
        <Table
          className="draggable-table snippets-table"
          id="cSnippetTable"
          components={ this.components }
          onRow={ this.onRow }
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
