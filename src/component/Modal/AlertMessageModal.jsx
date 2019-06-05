import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Spin, Modal, Button, Alert } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { shell, remote } from "electron";
import { getLogPath } from "service/io";
import * as classes from "./classes";

export class AlertMessageModal extends AbstractComponent {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired
    }),
    isVisible: PropTypes.bool.isRequired
  }

  state = {
    spinning: false
  }

  onOpenLog = () => {
    this.setState({ spinning: true });
    shell.openItem( getLogPath() );
    setTimeout( () => {
      this.setState({ spinning: false });
    }, 300 );
  }

  onReportIssue = ( e ) => {
    e.preventDefault();
    this.setState({ spinning: true });
    shell.openExternal( "https://github.com/dsheiko/puppetry/issues" );
    setTimeout( () => {
      this.setState({ spinning: false });
    }, 700 );
  }

  close() {
    this.props.action.removeAppTab( "testReport" );
    this.props.action.setApp({ alert: { visible: false }});
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  onReload = ( e ) => {
    e.preventDefault();
    remote.getCurrentWindow().reload();
  }

  // Do not update until visible
  shouldComponentUpdate( nextProps, nextState ) {
    if ( this.props.isVisible !== nextProps.isVisible ) {
      return true;
    }
    if ( !nextProps.isVisible ) {
      return false;
    }
    return true;
  }


  render() {
    const { isVisible, alert } = this.props;

    return (
      <ErrorBoundary>
        <Modal
          title={ alert.title || "Error" }
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          footer={[
            ( <Button
              key="reload"
              className={ classes.BTN_RELOAD }
              onClick={this.onReload}>
              Reload
            </Button> ),
            ( <Button
              className={ classes.BTN_LOG }
              key="log" onClick={this.onOpenLog}>
              Open error log
            </Button> ),
            ( <Button
              className={ classes.BTN_CANCEL }
              key="cancel" onClick={this.onReportIssue}>
              Report issue
            </Button> ),
            ( <Button
              className={ classes.BTN_OK }
              autoFocus={ true } key="submit" type="primary" onClick={this.onClickCancel}>
              Ok
            </Button> ) ]}
        >
          <Spin tip="Loading..." spinning={ this.state.spinning }>
            <Alert
              message={ alert.message }
              description={ alert.description }
              type={ alert.type || "error" }
              showIcon
            />
          </Spin>

        </Modal>
      </ErrorBoundary>
    );
  }
}

