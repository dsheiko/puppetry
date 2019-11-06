import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { DragableRow } from "./DragableRow";
import { confirmRemove, confirmClone } from "service/smalltalk";
import { findTargets } from "service/suite";
import { clipboardReadObj } from "service/copypaste";
import uniqid from "uniqid";
import { remote, clipboard } from "electron";


const { Menu, MenuItem } = remote,
      APP_NAME = remote.app.name,
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
          click: () => this.toggleVisibility( record, false )
        } : {
          label: "Disable",
          click: () => this.toggleVisibility( record, true )
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
      click: () => this.removeRecords( record )
    }) );

    menu.popup({
      x: e.x,
      y: e.y
    });
  }

  buildRowClassName( record ) {
    const selected = typeof this.state.selected === "undefined" ? new Set() : this.state.selected;
    if ( !this.state || !this.state.contextMenuAnchor ) {
      return classNames({
        "disable-dnd": record.adding,
        "disable-expand": record.adding,
        "is-row-selected": selected.has( record.id )
      });
    }
    return classNames({
      "is-right-clicked": this.state.contextMenuAnchor === record.id,
      "disable-dnd": record.adding,
      "disable-expand": record.adding,
      "is-row-selected": selected.has( record.id )
    });
  }

  onRowClassName = ( record ) => {
    return this.buildRowClassName( record );
  }

  onRow = ( record, index ) => ({
    index,
    moveRow: this.moveRow,
    onContextMenu: ( e ) => this.onContextMenu( e, record ),
    onClick: ( e ) => this.onClickRow( e, record )
  });


  resetSelected() {
    this.setState({ selected: new Set() });
  }
  /**
   * Register highlihted rows in the state
   */
  onClickRow = ( e, record ) => {
    if ( !e.shiftKey ) {
      return;
    }
    e.preventDefault();
    this.setState( ( state ) => {
      if ( typeof state.selected === "undefined" ) {
        state.selected = new Set();
      }
      if ( state.selected.has( record.id ) ) {
        state.selected.delete( record.id );
      } else {
        state.selected.add( record.id );
      }
      return state;
    });
  }

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
   * Helper to paste a set of records
   */
  static pasteRecords( update, records, dest ) {
    let destRec = dest;
    records.forEach( record  => {
      const id = uniqid();
      update( record, destRec, id );
      destRec = { id, testId: dest.testId, groupId: dest.groupId };

      if ( typeof dest.testId === "undefined" ) {
        delete destRec.testId;
      }
      if ( typeof dest.groupId === "undefined" ) {
        delete destRec.groupId;
      }
    });
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
          pasteMethod = `paste${ payload.model }`,
          update = this.props.action[ pasteMethod ],
          records = Array.isArray( payload.data ) ? payload.data : [ payload.data ];

    this.props.action.setApp({ loading: true });

    setTimeout( () => {

      if ( record.entity === "group" && payload.model === "Test" ) {
        AbstractDnDTable.pasteRecords( update, records, {
          groupId: record.id
        });
      }

      if ( record.entity === "test" && payload.model === "Command" ) {
        AbstractDnDTable.pasteRecords( update, records, {
          testId: record.id,
          groupId: record.groupId
        });
      }

      if ( record.entity === payload.model.toLowerCase() ) {
        // inject group/test/commands
        AbstractDnDTable.pasteRecords( update, records, record );
      }


      // inject required targets
      Object.values( payload.targets ).forEach( target => {
        if ( this.props.selector.hasTarget( target.target ) ) {
          return;
        }
        this.props.action.addTarget( target );
      });

      this.resetSelected();
      this.updateSuiteModified( record, "paste" );
      this.props.action.setApp({ loading: false });
    }, 200 );
  }

  /**
   * Return array of record by selected of if none by hovered one
   * @param {Object} record
   * @returns {Object[]}
   */
  getSelectedRecords( record ) {
    if ( typeof this.getRecords === "function" && this.state.selected && this.state.selected.size ) {
      return this.getRecords().filter( record => this.state.selected.has( record.id ) );
    }
    return [ record ];
  }

  /**
   * Extract key-value from targets
   */
  static findTargets( records ) {
    try {
      return Array.from( records.reduce( ( carry, record ) => {
        carry.add( findTargets( record ) );
        return carry;
      }, new Set() ) );
    } catch ( e ) {
      console.error( e );
      return []
    }
  }

  /**
   * Copy into clipboard
   */
  copyClipboard = ( record ) => {
    const records = this.getSelectedRecords( record ),
          payload = {
            app: {
              name: APP_NAME,
              version: APP_VERSION
            },
            model: this.model,
            data: records,
            targets: [ "Target", "Variable" ].includes( this.model )
              ? []
              // We attach targets referenced from copied records
              : this.props.selector.getSelectedTargets( AbstractDnDTable.findTargets( records ) )
          };

    this.resetSelected();
    clipboard.writeText( JSON.stringify( payload, null, 2 ) );
  }

  /**
   * Insert from clipboard
   */
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
    if ( "env" in record ) {
      node.env = record.env;
    }
    update( node, { "after": record.id });
    this.updateSuiteModified( node, "insert" );
  }

  cloneRecord = async ( record ) => {
    const update = this.props.action[ `clone${this.model}` ],
          records = this.getSelectedRecords( record );
    if ( records.length > 1 && !( await confirmClone( records.length ) ) ) {
      return;
    }
    this.props.action.setApp({ loading: true });
    // give it a chance to render loading state
    setTimeout( async () => {
      for ( const record of records ) {
        await update( record );
      }
      this.updateSuiteModified( record, "clone" );
      this.props.action.setApp({ loading: false });
    }, 200 );
  }

  removeRecords = async ( record ) => {
    const update = this.props.action[ `remove${this.model}` ],
          records = this.getSelectedRecords( record );

    if ( records.length > 1 && !( await confirmRemove( records.length ) ) ) {
      return;
    }
    this.props.action.setApp({ loading: true });
    // give it a chance to render loading state
    setTimeout( async () => {
      for ( const record of records ) {
        await update( this.extendActionOptions( record ) );
      }
      this.updateSuiteModified( record, "remove" );
      this.props.action.setApp({ loading: false });
    }, 200 );
  }

  toggleVisibility = async ( record, disabled ) => {
    const update = this.props.action[ `update${this.model}` ],
          records = this.getSelectedRecords( record );

    this.props.action.setApp({ loading: true });
    // give it a chance to render loading state
    setTimeout( () => {
      let obj;
      for ( const record of records ) {
        obj = disabled ? { id: record.id, disabled, failure: "" } : { id: record.id, disabled };
        update( this.extendActionOptions( obj ) );
      }
      this.updateSuiteModified( record, "update" );
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
