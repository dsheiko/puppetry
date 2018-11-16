import React from "react";
import { Table, Icon, Button, Divider, Popconfirm } from "antd";
import AbstractDnDTable from "../../AbstractDnDTable";
import { connectDnD } from "../../DragableRow";
import { CommandRowLabel } from "./CommandRowLabel";
import ErrorBoundary from "component/ErrorBoundary";
import { confirmDeleteEntity } from "service/smalltalk";
import { remote } from "electron";

const { Menu, MenuItem } = remote;

@connectDnD
export class CommandTable extends AbstractDnDTable {

  constructor( props ) {
    super( props );
    this.columns = [
      {
        title: "Comand",
        dataIndex: "target",

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

  onContextMenu = ( e, record  ) => {
    e.preventDefault();
    const menu = new Menu();

    menu.append( new MenuItem({
      label: "Edit",
      click: () => this.onEditCommand( record )
    }) );

    menu.append( new MenuItem(
      record.disabled ? {
        label: "Enable",
        click: () => this.updateRecord({ id: record.id, disabled: false })
      } : {
        label: "Disable",
        click: () => this.updateRecord({ id: record.id, disabled: true })
      }
    ) );

    menu.append( new MenuItem({
      label: "Clone",
      click: () => this.cloneRecord( record )
    }) );

    menu.append( new MenuItem({
      type: "separator"
    }) );

    menu.append( new MenuItem({
      label: "Delete",
      click: async () => {
        await confirmDeleteEntity( "command" ) && this.removeRecord( record.id );
      }
    }) );

    menu.popup({
      x: e.x,
      y: e.y
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

//  cloneRecord = ( command ) => {
//    const update = this.props.action[ `clone${this.model}` ];
//    update( command );
//    this.updateSuiteModified();
//  }


  addRecord = () => {
    const update = this.props.action[ `add${this.model}` ];
    update( this.extendActionOptions({ target: "", method: "" }) );
  }


  componentDidUpdate( prevProps ) {
    // Only when we add a new command to the list, so we can edit it in the modal
    if ( prevProps.commands.length !== this.props.commands.length ) {
      const newlyAdded = this.props.commands.find( command => !command.target && !command.method );
      newlyAdded && this.onEditCommand( newlyAdded );
    }
  }

  onEditCommand( record ) {
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
      className: "table-actions-cell",
      render: ( text, record ) => ( <span className="table-actions" role="status" >
        <a className="link--action"
          tabIndex={-1} role="button"
          onClick={ () => this.onEditCommand( record ) }>Edit</a>
        <Divider type="vertical" />
        <Popconfirm title="Sure to delete?" onConfirm={() => this.removeRecord( record.id )}>
          <a className="link--action" tabIndex={-2} role="button">Delete</a>
        </Popconfirm>
      </span> )
    };
  }

  onRowClassName = ( record ) => {

    return `model--command${ record.disabled ? " row-disabled" : "" }` ;
  }

  render() {
    const commands = this.props.commands.filter( command => command.target && command.method );
    return ( <ErrorBoundary>
      <Table
        className="draggable-table"
        components={ this.components }
        rowClassName={ this.onRowClassName }
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