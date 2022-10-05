import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button } from "antd";
import BrowseDirectory from "component/Global/BrowseDirectory";
import ErrorBoundary from "component/ErrorBoundary";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS, MODAL_DEFAULT_PROPS } from "constant";
import * as classes from "./classes";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const connectForm = Form.create();

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.saveProjectAsModal,
        files: state.app.project.files,
        filename: state.suite.filename 
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
@connectForm
export class SaveProjectAsModal extends AbstractForm {


  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      copyProjectTo: PropTypes.func.isRequired
    }),
    isVisible: PropTypes.bool.isRequired,
    projectDirectory: PropTypes.string
  }

  state = {
    locked: false,
    browseDirectoryValidateStatus: "",
    browseDirectoryValidateMessage: "",
    selectedDirectory: ""
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ saveProjectAsModal: false });
  }

  onClickOk = async ( e ) => {
    const { setApp, copyProjectTo } = this.props.action,
          projectDirectory = this.state.selectedDirectory || this.props.projectDirectory;

    e.preventDefault();
    if ( !this.isBrowseDirectoryValid() ) {
      return;
    }
    await copyProjectTo( projectDirectory );
    setApp({ saveProjectAsModal: false });
  }

  isBrowseDirectoryValid() {
    if ( !this.state.selectedDirectory ) {
      this.setState({ locked: true,  browseDirectoryValidateStatus: A_FORM_ITEM_ERROR });
      return false;
    }

    this.setState({ locked: false,  browseDirectoryValidateStatus: A_FORM_ITEM_SUCCESS });
    return true;
  }

  getSelectedDirectory = ( selectedDirectory ) => {
    this.setState({ selectedDirectory, locked: false });
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
    const { isVisible } = this.props;

    return (
      <ErrorBoundary>
        <Modal
          title="Save Project As..."
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          { ...MODAL_DEFAULT_PROPS }
          footer={[
            ( <Button
              className={ classes.BTN_CANCEL }
              key="back"
              onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button
              className={ classes.BTN_OK }
              key="submit"
              type="primary"
              autoFocus={ true }
              disabled={ this.state.locked }
              onClick={this.onClickOk}>
              Save
            </Button> )
          ]}
        >
          <Form>
            <BrowseDirectory
              id="inSaveProjectAsModal"
              defaultDirectory={ this.state.projectDirectory }
              validateStatus={ this.state.browseDirectoryValidateStatus }
              validateMessage={ this.state.browseDirectoryValidateMessage }
              getSelectedDirectory={ this.getSelectedDirectory }
              label="Project new location" />

          </Form>
        </Modal>
      </ErrorBoundary>
    );
  }
}
