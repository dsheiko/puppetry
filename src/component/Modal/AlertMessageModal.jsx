import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Spin, Modal, Button, Alert } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { shell } from "electron";
import { getLogPath } from "service/io";

export class AlertMessageModal extends AbstractComponent {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired
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
    this.props.action.updateApp({ alert: { visible: false }});
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
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
            ( <Button key="log" onClick={this.onOpenLog}>
              Open error log
            </Button> ),
            ( <Button key="cancel" onClick={this.onReportIssue}>
              Report issue
            </Button> ),
            ( <Button autoFocus={ true } key="submit" type="primary" onClick={this.onClickCancel}>
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

