import React from "react";
import { message } from "antd";
import { ipcRenderer } from "electron";
import { E_GIT_INIT, E_GIT_PULL, E_GIT_PUSH } from "constant";


export class GitEnhancedMenu extends React.Component {

  onFileGitCommit = () => {
    this.props.action.updateApp({ newGitCommitModal: true });
  }

  onFileGitPull = () => {
    const { git } = this.props.project;
    ipcRenderer.send( E_GIT_PULL, this.props.projectDirectory, {
      credentialsUsername: git.credentialsUsername,
      credentialsPassword: git.credentialsPassword,
      credentialsAcccessToken: git.credentialsAcccessToken
   });
  }

  onFileGitPush = () => {
    const { git } = this.props.project;
    ipcRenderer.send( E_GIT_PUSH, this.props.projectDirectory, {
      credentialsUsername: git.credentialsUsername,
      credentialsPassword: git.credentialsPassword,
      credentialsAcccessToken: git.credentialsAcccessToken
   });
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