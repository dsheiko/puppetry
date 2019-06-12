import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { DragableRow } from "./DragableRow";
import { confirmDeleteEntity } from "service/smalltalk";
import { findTargets } from "service/suite";
import { clipboardReadObj } from "service/copypaste";
import { remote, clipboard } from "electron";

const { Menu, MenuItem } = remote,
      APP_NAME = remote.app.getName(),
      APP_VERSION = remote.app.getVersion();

export default class AbstractDnDTable extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      swapTest: PropTypes.func,
      swapGroup: PropTypes.func,
      swapCommand: PropTypes.func,
      setApp: PropTypes.func,
      addTarget: PropTypes.func
    }),
    selector: PropTypes.object.isRequired,
    groupId: PropTypes.string.isRequired,
    testId: PropTypes.string.isRequired
  }

 components = {
   body: {
     row: DragableRow
   }
 };

  onContextMenu = ( e, record ) => {
    e.preventDefault();

    const menu = new Menu();

    this.setState({ contextMenuAnchor: record.id });
    menu.on( "menu-will-close", () => {
      this.setState({ contextMenuAnchor: null });
    });

    menu.append( new MenuItem({
      label: "Edit",
      click: () => this.onEdit( record )
    }) );


    if ( typeof this.constructor.displayName === "undefined" || this.constructor.displayName !== "TargetTable" ) {
      menu.append( new MenuItem(
        record.disabled ? {
          label: "Enable",
          click: () => this.updateRecord({ id: record.id, disabled: false })
        } : {
          label: "Disable",
          click: () => this.updateRecord({ id: record.id, disabled: true })
        }
      ) );
    }

    menu.append( new MenuItem({
      label: "Insert",
      click: () => this.insertRecord( record )
    }) );

    menu.append( new MenuItem({
      label: "Clone",
      click: () => this.cloneRecord( record )
    }) );

    menu.append( new MenuItem({
      type: "separator"
    }) );

    menu.append( new MenuItem({
      label: "Copy",
      click: () => this.copyClipboard( record )
    }) );


    menu.append( new MenuItem({
      label: "Paste",
      click: () => this.pasteClipboard( record ),
      enabled: this.validClipboard( record )
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

  buildRowClassName( record ) {
    if ( !this.state || !this.state.contextMenuAnchor ) {
      return classNames({
        "disable-dnd": record.adding,
        "disable-expand": record.adding
      });
    }
    return classNames({
      "is-right-clicked": this.state.contextMenuAnchor === record.id,
      "disable-dnd": record.adding,
      "disable-expand": record.adding
    });
  }

  onRowClassName = ( record ) => {
    return this.buildRowClassName( record );
  }

  onRow = ( record, index ) => ({
    index,
    moveRow: this.moveRow,
    onContextMenu: ( e ) => this.onContextMenu( e, record )
  });

  onEdit = ( record ) => {
    this.toggleEdit( record.id, true );
  }

  toggleEnable = ( record ) => {
    this.updateRecord({ id: record.id, disabled: !record.disabled });
  }

  validClipboard = ( record ) => {
    try {
      const payload = clipboardReadObj();
      return payload
        && (
          record.entity === payload.model.toLowerCase()
          || record.entity === "group" && payload.model === "Test"
          || record.entity === "test" && payload.model === "Command"
        )
        && payload.app.name === APP_NAME
        && payload.app.version === APP_VERSION;
    } catch ( err ) {
      return false;
    }
  }

  /**
   * @param {GroupEntity|TestEntity|CommandEntity|TargetEntity} record -
   *  represents position after which we paste data from clipboard
   */
  pasteClipboard = ( record ) => {

    if ( !this.validClipboard( record ) ) {
      return;
    }
    const payload = clipboardReadObj(),
          update = this.props.action[ `paste${ payload.model }` ];

    this.props.action.setApp({ loading: true });

    setTimeout( () => {

      if ( record.entity === "group" && payload.model === "Test" ) {
        update( payload.data, {
          groupId: record.id
        });
      }

      if ( record.entity === "test" && payload.model === "Command" ) {
        update( payload.data, {
          testId: record.id,
          groupId: record.groupId
        });
      }

      if ( record.entity === payload.model.toLowerCase() ) {
        // inject group/test/commands
        update( payload.data, record );
      }

      // inject required targets
      Object.values( payload.targets ).forEach( target => {
        if ( this.props.selector.hasTarget( target.target ) ) {
          return;
        }
        this.props.action.addTarget( target );
      });

      this.updateSuiteModified( record, "paste" );
      this.props.action.setApp({ loading: false });
    }, 200 );
  }

  copyClipboard = ( record ) => {
    const payload = {
      app: {
        name: APP_NAME,
        version: APP_VERSION
      },
      model: this.model,
      data: record,
      targets: [ "Target", "Variable" ].includes( this.model )
        ? []
        : this.props.selector.getSelectedTargets( findTargets( record ) )
    };
    clipboard.writeText( JSON.stringify( payload, null, 2 ) );
  }

  insertRecord = ( record ) => {
    const update = this.props.action[ `insertAdjacent${this.model}` ],
          node = { editing: true };
    // When insert a snippet, we need the flag to know what editing window to open
    if ( record.isRef ) {
      node.isRef = true;
    }
    if ( "groupId" in record ) {
      node.groupId = record.groupId;
    }
    if ( "testId" in record ) {
      node.testId = record.testId;
    }
    update( node, { "after": record.id });
    this.updateSuiteModified( node, "insert" );
  }

  cloneRecord = ( record ) => {
    const update = this.props.action[ `clone${this.model}` ];
    this.props.action.setApp({ loading: true });
    // give it a chance to render loading state
    setTimeout( () => {
      update( record );
      this.updateSuiteModified( record, "clone" );
      this.props.action.setApp({ loading: false });
    }, 200 );
  }

  /**
   * Extending for parents
   */
  extendActionOptions( options ) {
    if ( this.props.hasOwnProperty( "groupId" ) ){
      options.groupId = this.props.groupId;
    }
    if ( this.props.hasOwnProperty( "testId" ) ){
      options.testId = this.props.testId;
    }
    return options;
  }

  moveRow = ( dragIndex, hoverIndex, dragId, hoverId ) => {
    const update = this.props.action[ `swap${this.model}` ];
    update( this.extendActionOptions({
      sourceInx: dragIndex,
      targetInx: hoverIndex,
      sourceId: dragId,
      targetId: hoverId
    }) );
  };

}
