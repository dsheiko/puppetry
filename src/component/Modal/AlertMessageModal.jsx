import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Modal, Button, Alert } from "antd";
import ErrorBoundary from "component/ErrorBoundary";


export class AlertMessageModal extends AbstractComponent {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired
    }),
    isVisible: PropTypes.bool.isRequired
  }


  close() {
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
            ( <Button autoFocus={ true } key="submit" type="primary" onClick={this.onClickCancel}>
              Ok
            </Button> ) ]}
        >
          <Alert
            message={ alert.message }
            description={ alert.description }
            type={ alert.type || "error" }
            showIcon
          />

        </Modal>
      </ErrorBoundary>
    );
  }
}

