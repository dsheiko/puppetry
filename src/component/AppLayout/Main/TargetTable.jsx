import React from "react";
import { Table, Icon, Button } from "antd";
import AbstractEditableTable from "./AbstractEditableTable";
import { TargetSelectorCell } from "./EditableCell/TargetSelectorCell";
import { TargetVariableCell } from "./EditableCell/TargetVariableCell";
import { connectDnD } from "./DragableRow";
import { validateSelector } from "service/selector";
import ErrorBoundary from "component/ErrorBoundary";

@connectDnD
export class TargetTable extends AbstractEditableTable {

  static displayName = "TargetTable";


  constructor( props ) {
    super( props );

    this.fields = [ "target",  "selector" ];
    this.extraFields = { "selector": [ "parentType", "ref" ] };
    this.model = props.model || "Target";


    this.columns = [
      {
        title: "Target",
        dataIndex: "target",
        width: "30%",
        render: ( text, record ) => {
          const ref = this.registerRef( record.id, "target" );
          return ( <TargetVariableCell
            ref={ ref }
            record={ record }
            onSubmit={ this.onSubmit }
            dataIndex="target"
            className="input--target"
            placeholder="Enter target name"

            model={ this.model }
            updateRecord={ this.updateRecord }
          />
          );
        }
      },
      {
        title: "Selector",
        dataIndex: "selector",
        width: "calc(70% - 160px)",
        render: ( text, record ) => {
          const ref = this.registerRef( record.id, "selector" );
          return ( <TargetSelectorCell
            ref={ ref }
            record={ record }
            onSubmit={ this.onSubmit }
            dataIndex="selector"
            className="input--selector"
            placeholder="Enter CSS selector or xPath"
            model={ this.model }
            updateRecord={ this.updateRecord }
            targets={ this.props.targets }
          />
          );
        }
      },
      this.getActionColumn()
    ];

  }

  /**
   * Check selector on submit
   * @param {String} key
   * @param {String} value
   * @param {Form} form
   * @returns {Boolean}
   */
  validateFormField( key, value, form ) {
    if ( key !== "selector" ) {
      return true;
    }
    try {
      validateSelector( value );
    } catch ( e ) {
      form.setFields({
        selector: {
          value,
          errors: [ e ]
        }
      });
      return false;
    }
    return true;
  }


  onRowClassName = ( record ) => {
    return "model--target " + this.buildRowClassName( record );
  }

  onShowEditTargetsAsCsv = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ editTargetsAsCsvModal: true });
  }

  shouldComponentUpdate( nextProps ) {
    if ( this.props.targets !== nextProps.targets ) {
      return true;
    }
    return false;
  }

  render() {
    const data = this.props.targets;

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

            footer={() => ( <div className="ant-table-footer__toolbar">
              <Button type="dashed" id="cTargetTableEditCsvBtn"
                onClick={ this.onShowEditTargetsAsCsv }><Icon type="edit" />Edit as CSV</Button>
            </div> )}
          />
        </ErrorBoundary>
      </div>
    );
  }
}
