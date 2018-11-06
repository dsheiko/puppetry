import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Spin, Modal, Button, Alert } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { shell } from "electron";

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

  close() {
    this.props.action.removeAppTab( "testReport" );
    this.props.action.updateApp({ alert: { visible: false }});
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  onReportIssue = ( e ) => {
    e.preventDefault();
    this.setState({ spinning: true });
    shell.openExternal( "https://github.com/dsheiko/puppetry/issues" );
    setTimeout( () => {
      this.setState({ spinning: true });
      this.close();
    }, 800 );
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

