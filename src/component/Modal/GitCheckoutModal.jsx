import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Modal, Button, Table, Divider, Popconfirm } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { ipcRenderer } from "electron";
import { E_GIT_LOG, E_GIT_LOG_RESPONSE, E_GIT_REVERT, E_GIT_REVERT_RESPONSE, 
  E_GIT_CHECKOUT, E_GIT_CHECKOUT_RESPONSE } from "constant";
import * as classes from "./classes";
import { timestampToDate } from "service/utils";

/*eslint no-useless-escape: 0*/

export class GitCheckoutModal extends AbstractComponent {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired
    }),
    logs: PropTypes.array.isRequired,
    git: PropTypes.object.isRequired,
    projectDirectory: PropTypes.string,
    isVisible: PropTypes.bool.isRequired
  }

  columns = [
    {
      title: "Date",
      dataIndex: "committer",
      key: "timestamp",
      render: ( value ) => <span>{ timestampToDate( value.timestamp ) }</span>
    }, {
      title: "Commiter",
      dataIndex: "committer",
      key: "committer",
      render: ( value ) => <span>{ value.name }</span>
    }, {
      title: "Message",
      dataIndex: "message",
      key: "message"
    }, {
      title: "Actions",
      key: "actions",
      render: ( text, record ) => ( <span className="table-actions" role="status" onMouseDown={( e ) => e.preventDefault()}>
        <a className="link--action" tabIndex={-1}
              role="button" onClick={() => this.checkoutRecord( record.oid )}>Checkout</a>

        <Divider type="vertical" />

        <Popconfirm title="Sure to revert?" onConfirm={() => this.revertRecord( record.oid )}>
          <a className="link--action">Revert</a>
        </Popconfirm>


      </span> )
    }
  ]

  revertRecord( oid ) {
    ipcRenderer.send( E_GIT_REVERT, this.props.projectDirectory, oid );
  }

  checkoutRecord( oid ) {
    ipcRenderer.send( E_GIT_CHECKOUT, this.props.projectDirectory, oid );
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ gitCheckoutModal: false });
  }

  onCheckoutResponse = () => {
    this.props.action.loadProject();
    this.props.action.updateApp({ gitCheckoutModal: false });
  }

  componentDidMount() {
    ipcRenderer.removeAllListeners( E_GIT_CHECKOUT_RESPONSE );
    ipcRenderer.on( E_GIT_CHECKOUT_RESPONSE, this.onCheckoutResponse );
    ipcRenderer.removeAllListeners( E_GIT_REVERT_RESPONSE );
    ipcRenderer.on( E_GIT_REVERT_RESPONSE, this.onCheckoutResponse );

  }

  render() {
    const { isVisible, logs } = this.props,
          rows = logs.map( row => ({ ...row, key: row.oid }));

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

