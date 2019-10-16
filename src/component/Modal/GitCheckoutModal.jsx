import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Modal, Button, Table, Tag } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { ipcRenderer } from "electron";
import { E_GIT_CHECKOUT, E_GIT_CHECKOUT_RESPONSE, E_CHECKOUT_MASTER_OPEN, MODAL_DEFAULT_PROPS } from "constant";
import * as classes from "./classes";
import { tsToDateString } from "service/utils";
import mediator from "service/mediator";

/*eslint no-useless-escape: 0*/

export class GitCheckoutModal extends AbstractComponent {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired
    }),
    logs: PropTypes.array.isRequired,
    git: PropTypes.object.isRequired,
    projectDirectory: PropTypes.string,
    isVisible: PropTypes.bool.isRequired
  }

  columns = [
    {
      title: "Date",
      dataIndex: "author",
      key: "timestamp",
      render: ( value ) => <span>{ tsToDateString( value.timestamp ) }</span>
    }, {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: ( value ) => <span>{ value.name }</span>
    }, {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: "70%",
      render: ( value, record ) => <span><span title={ record.oid }><Tag>{
        record.oid.substr( 0, 8 ) }</Tag></span>{ " " }<span>{ value }</span></span>
    }, {
      title: "Actions",
      key: "actions",
      render: ( text, record ) => ( <span className="table-actions"
        role="status" onMouseDown={( e ) => e.preventDefault()}>
        <a className="link--action" tabIndex={-1}
          role="button" onClick={() => this.checkoutRecord( record.oid, record.message )}>Checkout</a>

      </span> )
    }
  ]


  checkoutRecord( oid, comment ) {
    ipcRenderer.send( E_GIT_CHECKOUT, this.props.projectDirectory, oid, comment );
    this.props.action.setApp({ gitCheckoutModal: false });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ gitCheckoutModal: false });
  }

  onCheckoutResponse = ( ev, oid, comment = "" ) => {
    this.props.action.loadProject();
    this.props.action.setApp({ gitDetachedHeadState: true });
    mediator.emit( E_CHECKOUT_MASTER_OPEN, comment );
  }

  componentDidMount() {
    ipcRenderer.removeAllListeners( E_GIT_CHECKOUT_RESPONSE );
    ipcRenderer.on( E_GIT_CHECKOUT_RESPONSE, this.onCheckoutResponse );
  }

  // Do not update until visible
  shouldComponentUpdate( nextProps ) {
    if ( this.props.isVisible !== nextProps.isVisible ) {
      return true;
    }
    if ( !nextProps.isVisible ) {
      return false;
    }
    return true;
  }

  render() {
    const { isVisible, logs } = this.props,
          rows = logs.map( row => ({ ...row, key: row.oid }) );

    return (
      <ErrorBoundary>
        <Modal
          title="Git Commits"
          visible={ isVisible }
          className="c-git-commits-modal"
          closable
          onCancel={ this.onClickCancel }
          bodyStyle={{ "overflow": "auto" }}
          width="80vw"
          { ...MODAL_DEFAULT_PROPS }
          footer={[
            ( <Button
              autoFocus={ true }
              className={ classes.BTN_CANCEL }
              key="cancel"
              onClick={ this.onClickCancel }>
              Close
            </Button> ) ]}
        >

          <Table dataSource={ rows } columns={ this.columns } />

        </Modal>
      </ErrorBoundary>
    );
  }
}

