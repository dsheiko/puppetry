import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { DragableRow } from "./DragableRow";
import { confirmDeleteEntity } from "service/smalltalk";
import { remote } from "electron";

const { Menu, MenuItem } = remote;

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

  getRightClickClassName( record ) {
    if ( !this.state || !this.state.contextMenuAnchor ) {
      return classNames({
        "disable-dnd": record.adding
      });
    }
    return classNames({
      "is-right-clicked": this.state.contextMenuAnchor === record.id,
      "disable-dnd": record.adding
    });
  }

  onRowClassName = ( record ) => {
    return this.getRightClickClassName( record );
  }

  onRow = ( record, index ) => ({
    index,
    moveRow: this.moveRow,
    onContextMenu: ( e ) => this.onContextMenu( e, record )
  });

  onEdit = ( record ) => {
    this.toggleEdit( record.id, true );
  }

  cloneRecord = ( command ) => {
    const update = this.props.action[ `clone${this.model}` ];
    this.props.action.updateApp({ loading: true });
    // give it a chance to render loading state
    setTimeout( () => {
      update( command );
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
