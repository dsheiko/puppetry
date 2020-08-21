import React from "react";
import { Table, Icon, Button } from "antd";
import AbstractEditableTable from "./AbstractEditableTable";
import { TargetSelectorCell } from "./EditableCell/TargetSelectorCell";
import { TargetVariableCell } from "./EditableCell/TargetVariableCell";
import { connectDnD } from "./DragableRow";
import { validateSelector } from "service/selector";
import ErrorBoundary from "component/ErrorBoundary";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        rows: selectors.getSuitePageDataTableMemoized( state )
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      });

@connect( mapStateToProps, mapDispatchToProps )
@connectDnD
export class PageTable extends AbstractEditableTable {

  static displayName = "PageTable";


  constructor( props ) {
    super( props );

    this.fields = [ "name",  "url" ];

    this.model = props.model || "Page";


    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "30%",
        render: ( text, record ) => {
          const ref = this.registerRef( record.id, "name" );
          return ( <TargetVariableCell
            ref={ ref }
            record={ record }
            onSubmit={ this.onSubmit }
            targets={ this.props.rows }
            dataIndex="name"
            className="input--name"
            placeholder="Enter window name"
            model={ this.model }
            updateRecord={ this.updateRecord }
          />
          );
        }
      },
      {
        title: "URL",
        dataIndex: "url",
        width: "calc(70% - 160px)",
        render: ( text, record ) => {
          const ref = this.registerRef( record.id, "url" );
          return ( <TargetSelectorCell
            ref={ ref }
            record={ record }
            onSubmit={ this.onSubmit }
            dataIndex="url"
            className="input--url"
            placeholder="Enter window URL"
            model={ this.model }
            updateRecord={ this.updateRecord }
            targets={ this.props.rows }
          />
          );
        }
      },
      this.getActionColumn()
    ];

  }



  onRowClassName = ( record ) => {
    return "model--page " + this.buildRowClassName( record );
  }

  /**
   * Override the abstract method to provide record array for Drag&Drop selected rows
   * @returns {Array}
   */
  getRecords() {
    return this.props.rows;
  }

  render() {
    const data = this.props.rows;
    return (
      <div className="box-margin-vertical is-relative">
        <a className="btn-to-bottom" href="#cPageTableEditCsvBtn">
          <Icon type="arrow-down" /></a>
        <ErrorBoundary>
          <Table
            id="cPageTable"
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
