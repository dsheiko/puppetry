import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import { Icon, Menu, Dropdown } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractPureComponent from "component/AbstractPureComponent";
import { confirmUnsavedChanges } from "service/smalltalk";
import If from "component/Global/If";
import { truncate } from "service/utils";
import { MainMenu } from "./Sider/MainMenu";
import { Toolbar } from "./Appbar/Toolbar";

const win = remote.getCurrentWindow();

export class Appbar extends AbstractPureComponent {

  state = {
    isMaximized: win.isMaximized()
  };

  render() {
    const { isMaximized } = this.state,
          { projectName, projectDirectory, action, store  } = this.props;

    return (<div className="applayout">
      <header className="appbar">


        <MainMenu
            action={ action }
            isProjectEmpty={ !store.app.project.files.length }
            isSuiteOpen={ !!store.suite.filename }
            projectDirectory={ projectDirectory }
            isProjectOpen={ !!projectDirectory }
            suiteModified={ !!store.suite.modified }
            readyToRunTests={ !!store.app.readyToRunTests }
            gitDetachedHeadState={ !!store.app.gitDetachedHeadState }
            gitConfigUsername={ store.git.configUsername }
            gitConfigEmail={ store.git.configEmail }
            isGitInitialized={ !!store.git.initialized }
            hasGitRemote={ !!store.git.hasRemote }
          />


        <Toolbar projectName={ store.project.name } suiteModified={ store.suite.modified } action={ action } />

      </header>

      <div className="applayout__layout">
      <aside>
        <div className={ "logo is-expanded" }>
          <div className="logo__item logo__expanded" >
            <img src="./assets/puppetry.svg" alt="Puppetry" />
            <h1>Puppetry
              <span>ver.{ " " + remote.app.getVersion() }</span>
            </h1>
          </div>
        </div>


      </aside>
      <main className="layout-content">
      2222
      </main>
      </div>

      </div>);
  }
}
