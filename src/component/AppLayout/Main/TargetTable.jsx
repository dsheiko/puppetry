import React from "react";
import { Table, Icon, Button } from "antd";
import AbstractEditableTable from "./AbstractEditableTable";
import { EditableCell } from "./EditableCell";
import { connectDnD } from "./DragableRow";
import ErrorBoundary from "component/ErrorBoundary";

@connectDnD
export class TargetTable extends AbstractEditableTable {

  constructor( props ) {
    super( props );

    this.columns = [
      {
        title: "Target",
        dataIndex: "target",
        width: "calc(50% - 80px)",
        render: ( text, record ) => (
          <EditableCell
            record={ record }
            dataIndex="target"
            placeholder="Enter target name"
            liftFormStateUp={ this.liftFormStateUp }
            updateRecord={ this.updateRecord }
          />
        )
      },
      {
        title: "Selector",
        dataIndex: "selector",
        width: "calc(50% - 80px)",
        render: ( text, record ) => (
          <EditableCell
            record={ record }
            dataIndex="selector"
            placeholder="Enter selector"
            liftFormStateUp={ this.liftFormStateUp }
            updateRecord={ this.updateRecord }
          />
        )
      },
      this.getActionColumn()
    ];

  }

  fields = [ "target", "selector" ];

  model = "Target";

  render() {
    const data = Object.values( this.props.targets );
    return (
      <div className="box-margin-vertical">
        <ErrorBoundary>
          <Table
            className="draggable-table"
            components={this.components}
            onRow={this.onRow}
            showHeader={ true }
            dataSource={ data }
            columns={this.columns}
            pagination={false}
            rowClassName="model--target"
            footer={() => ( <Button onClick={ this.addRecord }><Icon type="plus" />Add a target</Button> )}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

