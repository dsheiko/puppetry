import React from "react";
import PropTypes from "prop-types";
import log from "electron-log";
import { Button, Popconfirm, Divider } from "antd";
import AbstractDnDTable from "./AbstractDnDTable";
import { RowDropdown } from "./RowDropdown";
import { result } from "service/utils";

export default class AbstractEditableTable extends AbstractDnDTable {

  state = {
    id: "",
    contextMenuAnchor: null,
    fieldState: {
    }
  }

  constructor( props ) {
    super( props );
    this.fieldRefs = {};
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

  registerRef( id, field ) {
    const payload = id in this.fieldRefs ? this.fieldRefs[ id ] : {};
    payload[ field ] = React.createRef();
    this.fieldRefs[ id ] = payload;
    return this.fieldRefs[ id ][ field ];
  }

  extraFields = [];

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

  validateFormField() {
    return true;
  }

  onSubmit = async ( record ) => {
    try {
      const id = record.id,
            res = await Promise.all(
              Object.entries( this.fieldRefs[ id ])
                .filter( ( pair ) => pair[ 1 ].current !== null )
                .map( ([ key, ref ]) => {
                  return new Promise( ( resolve, reject ) => {
                    const fields = [ key ].concat( result( this.extraFields, key, []) );
                    ref.current.validateFields( fields, ( err, values ) => {
                      if ( err ) {
                        return reject( err );
                      }
                      if ( !this.validateFormField( key, values[ key ], ref.current ) ) {
                        return reject( "Invalid syntax" );
                      }
                      resolve( values );
                    });
                  });
                }) ),
            options = res.reduce( ( carry, obj ) => ({
              ...carry,
              ...obj,
              id,
              editing: false
            }), {});
      document.body.classList.toggle( "disable-dnd", false );
      this.updateRecord( options );
      if ( record.adding && this.onExpand ) {
        this.onExpand( true, this.extendActionOptions( record ) );
      }
    } catch ( e ) {
      if ( e instanceof Error ) {
        return log.error( `Renderer process: ${ this.constructor.displayName }.onSubmit(): ${ e }` );
      }
      console.warn( `Input rejected due to a validation error ${ JSON.stringify( e ) }`, e );
    }
  }


  // CRUD methods

  updateRecord = ( options ) => {
    const update = this.props.action[ `update${this.model}` ],
          payload = this.extendActionOptions( options );

    update( payload );
    this.updateSuiteModified( payload, "update" );
  }

  removeRecord = ( id ) => {
    const update = this.props.action[ `remove${this.model}` ],
          payload = this.extendActionOptions({ id });
    update( payload );
    this.updateSuiteModified( payload, "remove" );
  }


  addRecord = () => {
    const update = this.props.action[ `add${this.model}` ],
          payload = this.extendActionOptions({ title: "", editing: true });
    update( payload );
    this.updateSuiteModified( payload, "add" );
  }

  updateSuiteModified() {
    this.props.action.updateSuite({
      modified: true
    });
    typeof this.resetSelected === "function" && this.resetSelected();
    this.props.action.autosaveSuite();
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
              onClick={( () => this.onSubmit( record ) )}
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

              onClick={( () => this.onSubmit( record ) )}
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
