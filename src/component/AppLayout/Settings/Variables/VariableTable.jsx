import React from "react";
import { Table  } from "antd";
import AbstractEditableTable from "component/AppLayout/Main/AbstractEditableTable";
import { EditableCell } from "component/AppLayout/Main/EditableCell";
import { connectDnD } from "component/AppLayout/Main/DragableRow";
import ErrorBoundary from "component/ErrorBoundary";

@connectDnD
export class VariableTable extends AbstractEditableTable {

  static displayName = "VariableTable";

  constructor( props ) {
    super( props );

    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "30%",
        render: ( text, record ) => {
          const ref = this.registerRef( record.id, "name" );
          return ( <EditableCell
              ref={ ref }
              record={ record }
              onSubmit={ this.onSubmit }
              dataIndex="name"
              className="input--target"
              placeholder="Enter name"
              model={ this.model }
              updateRecord={ this.updateRecord }
            />
          );
        }
      },
      {
        title: "Value",
        dataIndex: "value",
        width: "calc(70% - 160px)",
        render: ( text, record ) => (
          <EditableCell
            record={ record }
            onSubmit={ this.onSubmit }
            dataIndex="value"
            className="input--selector"
            placeholder="Enter value"
            liftFormStateUp={ this.liftFormStateUp }
            model={ this.model }
            updateRecord={ this.updateRecord }
          />
        )
      },
      this.getActionColumn()
    ];

  }

  onRowClassName = ( record ) => {
    return "model--variable " + this.buildRowClassName( record );
  }

  onShowEditTargetsAsCsv = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ editTargetsAsCsvModal: true });
  }

  /**
   * Extending for env
   */
  extendActionOptions( options ) {
    options.env = this.props.env;
    return options;
  }

  fields = [ "name", "value" ];

  model = "Variable";

  shouldComponentUpdate( nextProps ) {
    if ( this.props.variables !== nextProps.variables ) {
      return true;
    }
    return false;
  }

  updateSuiteModified( record, action ) {
    if ([ "update" ].includes( action ) ) {
      this.props.action.syncVariableStages( record );
    }
    this.props.action.updateSuite({
      modified: true
    });
    this.props.action.saveProject();
  }

  render() {
    const data = this.props.variables;

    return (
      <div className="box-margin-vertical">
        <ErrorBoundary>
          <Table
            id="cTargetTable"
            className="draggable-table"
            components={this.components}
            rowClassName={ this.onRowClassName }
            onRow={this.onRow}
            showHeader={ true }
            dataSource={ data }
            columns={this.columns}
            pagination={false}

          />
        </ErrorBoundary>
      </div>
    );
  }
}
