import React from "react";
import { Table, Icon, Button } from "antd";
import AbstractEditableTable from "./AbstractEditableTable";
import { connectDnD } from "./DragableRow";
import ErrorBoundary from "component/ErrorBoundary";
import { TestTable } from "./GroupTable/TestTable";
import { EditableCell } from "./EditableCell";

const recordPrefIcon = <Icon type="idcard" title="Group" />;

@connectDnD
export class GroupTable extends AbstractEditableTable {

  constructor( props ) {
    super( props );
    this.columns = [
      {
        title: "Group",
        dataIndex: "title",
        width: "calc(100% - 160px)",
        render: ( text, record ) => (
          <EditableCell
            prefixIcon={ recordPrefIcon }
            record={ record }
            dataIndex="title"
            placeholder="Describe target or scenario you want to test"
            liftFormStateUp={ this.liftFormStateUp }
            updateRecord={ this.updateRecord }
          />
        )
      },
      this.getActionColumn()
    ];

  }

  fields = [ "title" ];

  model = "Group";

  onExpand = ( isExpanded, record ) => {
    const expanded = { ...this.props.expanded };
    expanded[ record.id ] = {
      key: record.key,
      value: isExpanded,
      tests: {}
    };
    this.props.action.setProject({
      groups: expanded
    });
  }

  renderExpandedTable = ( group ) => {
    const tests = Object.values( group.tests ),
          targets = Object.values( this.props.targets );
    return ( <TestTable
      expanded={ this.props.expanded }
      targets={targets}
      tests={tests}
      groupId={group.id}
      action={this.props.action} /> );
  }

  render() {
    const groups = Object.values( this.props.groups ),
          expanded = Object.values( this.props.expanded )
            .filter( item => Boolean( item.value ) )
            .map( item => item.key );

    return (
      <div className="box-margin-vertical group-table">
        <ErrorBoundary>
          <Table
            className="draggable-table"
            components={this.components}
            onRow={this.onRow}
            rowClassName="model--group"
            showHeader={false}
            defaultExpandedRowKeys={ expanded }
            dataSource={ groups }
            columns={this.columns}
            pagination={false}
            onExpand={this.onExpand}
            expandedRowRender={ this.renderExpandedTable }
            footer={() => ( <Button onClick={ this.addRecord }><Icon type="plus" />Add a group</Button> )}
          />
        </ErrorBoundary>
      </div>
    );
  }
}