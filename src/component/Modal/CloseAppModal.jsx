import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { msgDataSaved } from "component/Global/Message";
import { Modal, Button } from "antd";
import { closeApp } from "service/utils";
import ErrorBoundary from "component/ErrorBoundary";


export class CloseAppModal extends AbstractForm {

   static propTypes = {
     action:  PropTypes.shape({
       updateApp: PropTypes.func.isRequired,
       saveSuite: PropTypes.func.isRequired
     }),
     suiteFilename: PropTypes.string.isRequired,
     isVisible: PropTypes.bool.isRequired
   }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ closeAppModal: false });
    closeApp();
  }

  onClickOk = async ( e ) => {
    e.preventDefault();
    await this.props.action.saveSuite();
    msgDataSaved();
    closeApp();
  }

  render() {
    const { isVisible, suiteFilename } = this.props;

    return (
      <ErrorBoundary>
        <Modal
          title="Exit Confirmation"
          visible={ isVisible }
          footer={[
            ( <Button key="back" onClick={this.onClickCancel}>Exit without saving</Button> ),
            ( <Button key="submit" type="primary"
              autoFocus={ true }
              onClick={this.onClickOk}>
              Save and exit
            </Button> )
          ]}
        >
          <p>You have unsaved files:</p>
          <p>{ suiteFilename }</p>
        </Modal>
      </ErrorBoundary>
    );
  }
}

