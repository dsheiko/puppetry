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
      updateApp: PropTypes.func
    }),

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
      enabled: this.validClipboard()
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

  validClipboard = () => {
    try {
      const payload = clipboardReadObj();
      return payload
        && payload.model === this.model
        && payload.app.name === APP_NAME
        && payload.app.version === APP_VERSION;
    } catch ( err ) {
      return false;
    }
  }

  pasteClipboard = ( record ) => {
    if ( !this.validClipboard() ) {
      return;
    }
    const payload = clipboardReadObj(),
          update = this.props.action[ `paste${ payload.model }` ];
    this.props.action.updateApp({ loading: true });
    setTimeout( () => {
      // inject group/test/commands
      update( payload.data, record );
      // inject required targets
      Object.values( payload.targets).forEach( target => {
        if ( this.props.selector.hasTarget( target.target ) ) {
          return;
        }
        this.props.action.addTarget( target );
      });
      this.props.action.updateApp({ loading: false });
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
      targets: this.model === "Target"
        ? []
        : this.props.selector.getSelectedTargets( findTargets( record ) )
    };
    clipboard.writeText( JSON.stringify( payload, null, 2 ) );
  }

  insertRecord = ( record ) => {
    const update = this.props.action[ `insertAdjacent${this.model}` ],
          node = { editing: true };
    if ( "groupId" in record ) {
      node.groupId = record.groupId;
    }
    if ( "testId" in record ) {
      node.testId = record.testId;
    }
    update( node, { "after": record.id } );
    this.updateSuiteModified();
  }

  cloneRecord = ( record ) => {
    const update = this.props.action[ `clone${this.model}` ];
    this.props.action.updateApp({ loading: true });
    // give it a chance to render loading state
    setTimeout( () => {
      update( record );
      this.updateSuiteModified();
      this.props.action.updateApp({ loading: false });
    }, 200 );
  }

  /**
   * Extending for pareants
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
