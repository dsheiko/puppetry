import React from "react";
import PropTypes from "prop-types";
import { Icon, Menu, Dropdown, Button, Popconfirm, Divider } from "antd";
import AbstractDnDTable from "./AbstractDnDTable";
import { RowDropdown } from "./RowDropdown";

export default class AbstractEditableTable extends AbstractDnDTable {

  state = {
    id: "",
    contextMenuAnchor: null,
    fieldState: {
    }
  }

  static propTypes = {
    action: PropTypes.shape({
      updateSuite: PropTypes.func.isRequired,
      addTarget: PropTypes.func.isRequired,
      updateTarget: PropTypes.func.isRequired,
      removeTarget: PropTypes.func.isRequired,
      addGroup: PropTypes.func.isRequired,
      updateGroup: PropTypes.func.isRequired,
      removeGroup: PropTypes.func.isRequired,
      addTest: PropTypes.func.isRequired,
      updateTest: PropTypes.func.isRequired,
      removeTest: PropTypes.func.isRequired,
      addCommand: PropTypes.func.isRequired,
      updateCommand: PropTypes.func.isRequired,
      removeCommand: PropTypes.func.isRequired
    }),
    testId: PropTypes.string,
    groupId: PropTypes.string
  }


  /**
   * Binding typing events to Redux store
   */
  liftFormStateUp = ( dataIndex, state, id ) => {

    this.setState( prevState => {
      if ( !prevState.fieldState.hasOwnProperty( id ) ) {
        prevState.fieldState[ id ] = {};
      }
      prevState.fieldState[ id ][ dataIndex ] = state;
      return prevState;
    });
  }


  hasErrors( id ) {
    if ( !this.state.fieldState.hasOwnProperty( id ) ) {
      return false;
    }
    const values = Object.values( this.state.fieldState[ id ]);
    return values.some( state => !state.pristine && !!state.error );
  }

  toggleEdit = ( id, editing ) => {
    const update = this.props.action[ `update${this.model}` ];
    document.body.classList.toggle( "disable-dnd", editing );
    update( this.extendActionOptions({ id, editing }) );
  }

  cancelEdit = ( record ) => {
    const isNew = this.fields.map( field => record[ field ]).every( value => !value );
    this.toggleEdit( record.id, false );
    if ( isNew ) {
      this.removeRecord( record.id );
    }
  }

  onSubmit = ( id ) => {
    const form = this.state.fieldState[ id ],
          options = this.fields.reduce( ( carry, field ) => {
            carry[ field ] = form[ field ].value;
            return carry;
          }, { id, editing: false });
    document.body.classList.toggle( "disable-dnd", false );
    this.updateRecord( options );
  }


  // CRUD methods

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
    update( this.extendActionOptions({ title: "", editing: true }) );
    this.updateSuiteModified();
  }

  updateSuiteModified() {
    this.props.action.updateSuite({
      modified: true
    });
  }

  getActionColumn() {
    return {
      title: "Action",
      dataIndex: "action",
      width: 160,
      className: "table-actions-cell",
      render: ( text, record ) => {
        const isNotTargetTable = ( typeof this.constructor.displayName === "undefined"
          || this.constructor.displayName !== "TargetTable" );

        if ( record.adding ) {
          return ( <span className="table-actions"  role="status" onMouseDown={( e ) => e.preventDefault()}>
            <Button
              tabIndex={20}
              type="primary"
              size="small"
              className={ `btn--submit-editable model--${ this.model }` }
              disabled={ this.hasErrors( record.id ) }
              onClick={( () => this.onSubmit( record.id ) )}
            >Add</Button>
          </span> );
        }
        if ( record.editing ) {
          return ( <span className="table-actions"  role="status" onMouseDown={( e ) => e.preventDefault()}>

            <Button
              tabIndex={20}
              type="primary"
              size="small"
              className={ `btn--submit-editable model--${ this.model }` }
              disabled={ this.hasErrors( record.id ) }
              onClick={( () => this.onSubmit( record.id ) )}
            >Save</Button>

            <Divider type="vertical" />

            <a tabIndex={21} role="button" onClick={() => this.cancelEdit( record )}>Cancel</a>
          </span> );
        }
        return (
          <span className="table-actions" role="status" onMouseDown={( e ) => e.preventDefault()}>


            <a className="link--action" tabIndex={-1}
              role="button" onClick={() => this.toggleEdit( record.id, true )}>Edit</a>

            <Divider type="vertical" />

            <Popconfirm title="Sure to delete?" onConfirm={() => this.removeRecord( record.id )}>
              <a className="link--action">Delete</a>
            </Popconfirm>


            <Divider type="vertical" />

            <RowDropdown
              record={ record }
              validClipboard={ this.validClipboard }
              isNotTargetTable={ isNotTargetTable }
              toggleEnable={ this.toggleEnable }
              insertRecord={ this.insertRecord }
              cloneRecord={ this.cloneRecord }
              copyClipboard={ this.copyClipboard }
              pasteClipboard={ this.pasteClipboard }
              />

          </span>
        );
      }
    };
  }

}
