import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Modal, Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";


export class ConfirmDeleteModal extends AbstractComponent {

   static propTypes = {
     action:  PropTypes.shape({
       updateApp: PropTypes.func.isRequired
     }),

     isVisible: PropTypes.bool.isRequired,
     selectedFile: PropTypes.string.isRequired
   }

   close() {
     this.props.action.updateApp({ confirmDeleteModal: false });
   }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  onClickOk = ( e ) => {
    e.preventDefault();
    this.props.action.removeSuite( this.props.selectedFile );
    this.close();
  }


  render() {
    const { isVisible, selectedFile } = this.props;

    return (
      <ErrorBoundary>
        <Modal
          title={ null }
          closable={ false }
          visible={ isVisible }
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          cancelText="No"
          okText="Yes"
          okType="danger"
        >
          <Icon type="exclamation-circle" />{ " " }
          Are you sure you want to delete { selectedFile } suite?
        </Modal>
      </ErrorBoundary>
    );
  }
}

