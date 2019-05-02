import React from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { ipcRenderer } from "electron";
import { confirmUnsavedChanges } from "service/smalltalk";
import { dateToTs } from "service/utils";
import { E_GIT_INIT,
  E_GIT_LOG, E_GIT_LOG_RESPONSE, E_GIT_COMMIT_RESPONSE } from "constant";


export class GitEnhancedMenu extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired,
      addAppTab: PropTypes.func.isRequired,
      saveProjectGit: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired
    }),
    project: PropTypes.object.isRequired,
    readyToRunTests: PropTypes.bool.isRequired,
    projectDirectory: PropTypes.string.isRequired,
    suiteModified: PropTypes.bool.isRequired
  }

  gitEnhancedMenuDidMount() {
    ipcRenderer.removeAllListeners( E_GIT_COMMIT_RESPONSE );
    ipcRenderer.on( E_GIT_COMMIT_RESPONSE, this.onFileGitCommitResponse );
  }

  onFileGitClone = () => {
    this.props.action.updateApp({ gitCloneModal: true });
  }

  onFileGitCommitResponse = () => {
    this.props.action.saveProjectGit({
      commitedAt: dateToTs()
    });
  }

  onFileGitCheckout = () => {
    this.props.action.updateApp({ gitCheckoutModal: true });
    setTimeout( () => {
      ipcRenderer.send(
        E_GIT_LOG,
        this.props.projectDirectory
      );
      ipcRenderer.removeAllListeners( E_GIT_LOG_RESPONSE );
      ipcRenderer.on( E_GIT_LOG_RESPONSE, ( ev, logs ) => {
        this.props.action.updateApp({ gitLogs: logs });
      });
    }, 10 );
  }

  onFileGitCommit = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.updateApp({ gitCommitModal: true });
  }

  onFileGitSync = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.updateApp({ gitSyncModal: true });
  }

  onFileGitInitialize = () => {
    const { projectDirectory } = this.props,
          { git } = this.props.project;

    if ( !projectDirectory ) {
      message.error( "Project directory is not specified" );
      return;
    }

    if ( !git.configUsername.trim() || !git.configEmail.trim() ) {
      message.error( "You need to provide GIT configuration first" );
      this.props.action.addAppTab( "settings" );
      return;
    }

    ipcRenderer.send( E_GIT_INIT, projectDirectory );
    this.props.action.saveProjectGit({ initialized: true });
  }

}