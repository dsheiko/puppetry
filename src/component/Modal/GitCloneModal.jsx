import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import BrowseDirectory from "component/Global/BrowseDirectory";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS } from "constant";
import { isDirEmpty } from "service/io";
import { confirmCreateProject } from "service/smalltalk";
import { ipcRenderer } from "electron";
import * as classes from "./classes";
import { E_GIT_CLONE, E_GIT_CLONE_RESPONSE } from "constant";

export class GitCloneModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      loadProject: PropTypes.func.isRequired
    }),

    isVisible: PropTypes.bool.isRequired,
    git: PropTypes.object.isRequired,
    projectDirectory: PropTypes.string.isRequired
  }

  state = {
    locked: false,
    browseDirectoryValidateStatus: "",
    selectedDirectory: ""
  }

  close() {
    this.props.action.setApp({ gitCloneModal: false });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  onClickOk = async ( e ) => {
    const { git } = this.props,
          projectDirectory = this.state.selectedDirectory || this.props.projectDirectory;

    e.preventDefault();

    if ( !this.isBrowseDirectoryValid() ) {
      return;
    }

    if ( !isDirEmpty( projectDirectory ) && !await confirmCreateProject() ) {
      return;
    }

    this.projectDirectory = projectDirectory;

    ipcRenderer.send(
      E_GIT_CLONE,
      projectDirectory,
      git.remoteRepository, {
        credentialsAuthMethod: git.credentialsAuthMethod,
        credentialsUsername: git.credentialsUsername,
        credentialsPassword: git.credentialsPassword,
        credentialsAccessToken: git.credentialsAccessToken
      }
    );

    this.close();
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

  onFileGitCloneResponse = () => {
    this.props.action.loadProject( this.projectDirectory );
  }

  componentDidMount() {
    ipcRenderer.removeAllListeners( E_GIT_CLONE_RESPONSE );
    ipcRenderer.on( E_GIT_CLONE_RESPONSE, this.onFileGitCloneResponse );
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
          title="Clone Project"
          className="c-git-clone-project-modal"
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          footer={[
            ( <Button
              key="back"
              className={ classes.BTN_CANCEL }
              onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button
              key="submit"
              type="primary"
              className={ classes.BTN_OK }
              disabled={ this.state.locked }
              autoFocus={ true }
              onClick={this.onClickOk}>
              Clone
            </Button> )
          ]}
        >
          <Form>

            <BrowseDirectory
              defaultDirectory={ this.state.projectDirectory }
              validateStatus={ this.state.browseDirectoryValidateStatus }
              getSelectedDirectory={ this.getSelectedDirectory }
              label="Project new location" />

          </Form>
        </Modal>
      </ErrorBoundary>
    );
  }
}
