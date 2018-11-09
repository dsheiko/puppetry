import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { msgDataSaved } from "component/Global/Message";
import { Modal, Button } from "antd";
import ErrorBoundary from "component/ErrorBoundary";


export class ConfirmSaveChanges extends AbstractForm {

   static propTypes = {
     action:  PropTypes.shape({
       updateApp: PropTypes.func.isRequired,
       openSuiteFile: PropTypes.func.isRequired,
       saveSuite: PropTypes.func.isRequired,
       setSuite: PropTypes.func.isRequired
     }),
     newFilename: PropTypes.string.isRequired,
     suiteFilename: PropTypes.string.isRequired,
     isVisible: PropTypes.bool.isRequired
   }

   next() {
     const { newFilename } = this.props;
     this.props.action.updateApp({ confirmSaveChangesModal: false });
     this.props.action.openSuiteFile( newFilename );
   }

  onClose = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ confirmSaveChangesModal: false });
  }

  onClickWithout = ( e ) => {
    e.preventDefault();
    this.next();
  }

  onClickOk = async ( e ) => {
    e.preventDefault();
    await this.props.action.saveSuite();
    msgDataSaved();
    this.next();
  }

  render() {
    const { isVisible, suiteFilename } = this.props;

    return (
      <ErrorBoundary>
        <Modal
          title="Open suite has unsaved changes"
          onCancel={ this.onClose }
          visible={ isVisible }
          footer={[
            ( <Button key="back" onClick={this.onClickWithout }>Proceed without saving</Button> ),
            ( <Button key="submit" type="primary"
              autoFocus={ true }
              onClick={this.onClickOk}>
              Save and proceed
            </Button> )
          ]}
        >
          <p>You have unsaved changes in:</p>
          <p>{ suiteFilename }</p>
        </Modal>
      </ErrorBoundary>
    );
  }
}

