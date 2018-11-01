import React from "react";
import { Table, Icon, Button, Divider, Popconfirm } from "antd";
import AbstractDnDTable from "../../AbstractDnDTable";
import { connectDnD } from "../../DragableRow";
import { CommandRowLabel } from "./CommandRowLabel";
import ErrorBoundary from "component/ErrorBoundary";

@connectDnD
export class CommandTable extends AbstractDnDTable {

  constructor( props ) {
    super( props );
    this.columns = [
      {
        title: "Comand",
        dataIndex: "target",
        width: "calc(100% - 160px)",
        render: ( text, record ) => ( <CommandRowLabel record={ record } /> )
      },
      this.getActionColumn()
    ];

  }

  model = "Command";

  updateSuiteModified() {
    this.props.action.updateSuite({
      modified: true
    });
  }

  updateRecord = ( options ) => {
    const update = this.props.action[ `update${this.model}` ];
    update( this.extendActionOptions( options  ) );
    this.updateSuiteModified();
  }

  removeRecord = ( id ) => {
    const update = this.props.action[ `remove${this.model}` ];
    update( this.extendActionOptions({ id }) );
    this.updateSuiteModified();
  }


  addRecord = () => {
    const update = this.props.action[ `add${this.model}` ];
    update( this.extendActionOptions({ target: "", method: "" }) );
  }


  componentDidUpdate( prevProps ) {
    // Only when we add a new command to the list, so we can edit it in the modal
    if ( prevProps.commands.length !== this.props.commands.length ) {
      const newlyAdded = this.props.commands.find( command => !command.target && !command.method );
      newlyAdded && this.onEdit( newlyAdded );
    }
  }

  onEdit( record ) {
    const { updateApp } = this.props.action;

    updateApp({
      commandModal: {
        isVisible: true,
        record,
        targets: this.props.targets,
        commands: this.props.commands
      }
    });

  }

  getActionColumn() {
    return {
      title: "Action",
      dataIndex: "action",
      width: 160,
      render: ( text, record ) => ( <span>
        <a className="link--action"
          tabIndex={-1} role="button"
          onClick={ () => this.onEdit( record ) }>Edit</a>
        <Divider type="vertical" />
        <Popconfirm title="Sure to delete?" onConfirm={() => this.removeRecord( record.id )}>
          <a className="link--action" tabIndex={-2} role="button">Delete</a>
        </Popconfirm>
      </span> )
    };
  }

  render() {
    const commands = this.props.commands.filter( command => command.target && command.method );
    return ( <ErrorBoundary>
      <Table
        className="draggable-table"
        components={ this.components }
        rowClassName="model--command"
        onRow={ this.onRow }
        showHeader={ false }
        dataSource={ commands }
        columns={ this.columns }
        pagination={ false }
        footer={() => ( <Button onClick={ this.addRecord }><Icon type="plus" />Add a command</Button> )}
      />
    </ErrorBoundary> );
  }
}