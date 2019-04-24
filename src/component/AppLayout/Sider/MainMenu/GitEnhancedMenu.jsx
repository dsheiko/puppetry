import React from "react";
import { message } from "antd";
import { ipcRenderer } from "electron";
import { E_GIT_INIT } from "constant";


export class GitEnhancedMenu extends React.Component {

  onFileGitCommit = () => {
    this.props.action.updateApp({ newGitCommitModal: true });
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