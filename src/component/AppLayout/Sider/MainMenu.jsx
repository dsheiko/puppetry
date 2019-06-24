import React from "react";
import PropTypes from "prop-types";
import { Menu, Icon, message } from "antd";
import { ipcRenderer } from "electron";
import Hotkeys from "react-hot-keys";
import ErrorBoundary from "component/ErrorBoundary";
import { msgDataSaved } from "component/Global/Message";
import { confirmUnsavedChanges } from "service/smalltalk";
import { E_MENU_NEW_PROJECT, E_MENU_NEW_SUITE, SNIPPETS_FILENAME,
  E_MENU_OPEN_PROJECT, E_MENU_SAVE_SUITE, E_MENU_SAVE_SUITE_AS,
  E_MENU_OPEN_SUITE, E_MENU_EXPORT_PROJECT, E_MENU_EXIT_APP,
  E_MENU_RUN, E_RENDERER_ERROR, E_RENDERER_INFO } from "constant";
import { ostr } from "./MainMenu/helpers";
import { GitEnhancedMenu } from "./MainMenu/GitEnhancedMenu";

const SubMenu = Menu.SubMenu;

export class MainMenu extends GitEnhancedMenu {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired,
      closeApp: PropTypes.func.isRequired,
      removeAppTab: PropTypes.func.isRequired
    }),
    files: PropTypes.array.isRequired,
    readyToRunTests: PropTypes.bool.isRequired,
    projectDirectory: PropTypes.string,
    suiteFilename: PropTypes.string,
    suiteModified: PropTypes.bool
  }


  hotkeyMap = {
    "ctrl+s": "onSave",
    "command+s": "onSave",

    "ctrl+shift+s": "onFileGitCommit",
    "command+shift+s": "onFileGitCommit",

    "ctrl+n": "onNewSuite",
    "command+n": "onNewSuite",

    "ctrl+shift+n": "onNewProject",
    "command+shift+n": "onNewProject",

    "ctrl+shift+p": "onOpenProject",
    "command+shift+p": "onOpenProject",

    "ctrl+shift+e": "onExportProject",
    "command+shift+e": "onExportProject",

    "f6": "onF6"
  }

  onF6 = () => {
    const { readyToRunTests } = this.props;
    this[ readyToRunTests ? "onTestReport" : "onRuntimeTestInstall" ]();
  }

  onKeyDown = ( keyNm, e ) => {
    if ( this.hotkeyMap.hasOwnProperty( keyNm ) ) {
      this[ this.hotkeyMap[ keyNm ] ]( e );
    }
  }

  onSave = () => {
    const { suiteFilename, projectDirectory } = this.props;
    if ( !projectDirectory ) {
      return;
    }
    if ( !suiteFilename ) {
      return this.onSaveAs();
    }
    this.props.action.saveSuite();
    msgDataSaved();
  }

  onSaveAs = () => {
    const { projectDirectory } = this.props;
    if ( !projectDirectory ) {
      return;
    }
    this.props.action.setApp({ saveSuiteAsModal: true });
  }

  onSaveProjectAs = () => {
    const { projectDirectory } = this.props;
    if ( !projectDirectory ) {
      return;
    }
    this.props.action.setApp({ saveProjectAsModal: true });
  }

  onNewProject = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.setApp({ newProjectModal: true });
  }

  onOpenProject = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.setApp({ openProjectModal: true });
  }

  onOpenSuite = async () => {
    const { projectDirectory, files } = this.props;
    if ( !projectDirectory || !files.length ) {
      return;
    }
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.setApp({ openSuiteModal: true });
  }

  onNewSuite = async () => {
    const { projectDirectory } = this.props;
    if ( !projectDirectory ) {
      return;
    }
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.setApp({ newSuiteModal: true });
  }

  onTestReport = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.removeAppTab( "testReport" );
    this.props.action.setApp({ testReportModal: true });
  }

  onRuntimeTestInstall = () => {
    const { projectDirectory } = this.props;
    if ( !projectDirectory ) {
      return;
    }
    this.props.action.setApp({ installRuntimeTestModal: true });
  }

  onExit = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.closeApp();
  }

  onExportProject = async () => {
    const { projectDirectory } = this.props;
    if ( !projectDirectory ) {
      return;
    }
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    return this.props.action.setApp({ exportProjectModal: true });
  }

  onSnippets = async () => {
    const { openSuiteFile, saveSuite, setSuite } = this.props.action;

    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite,
        setSuite
      });
    }

    openSuiteFile( SNIPPETS_FILENAME );
  }

  onSettings = async () => {
    this.props.action.addAppTab( "settings" );
  }

  onRendererInfo( ev, msg ) {
    message.info( msg );
  }

  onRendererError( ev, msg ) {
    message.error( msg );
  }

  componentDidMount() {
    this.gitEnhancedMenuDidMount();
    ipcRenderer.removeAllListeners( E_RENDERER_INFO );
    ipcRenderer.on( E_RENDERER_INFO, this.onRendererInfo );
    ipcRenderer.removeAllListeners( E_RENDERER_ERROR );
    ipcRenderer.on( E_RENDERER_ERROR, this.onRendererError );
    ipcRenderer.removeAllListeners( E_MENU_NEW_PROJECT );
    ipcRenderer.on( E_MENU_NEW_PROJECT, this.onNewProject );
    ipcRenderer.removeAllListeners( E_MENU_NEW_SUITE );
    ipcRenderer.on( E_MENU_NEW_SUITE, this.onNewSuite );
    ipcRenderer.removeAllListeners( E_MENU_OPEN_PROJECT );
    ipcRenderer.on( E_MENU_OPEN_PROJECT, this.onOpenProject );
    ipcRenderer.removeAllListeners( E_MENU_OPEN_SUITE );
    ipcRenderer.on( E_MENU_OPEN_SUITE, this.onOpenSuite );
    ipcRenderer.removeAllListeners( E_MENU_SAVE_SUITE );
    ipcRenderer.on( E_MENU_SAVE_SUITE, this.onSave );
    ipcRenderer.removeAllListeners( E_MENU_SAVE_SUITE_AS );
    ipcRenderer.on( E_MENU_SAVE_SUITE_AS, this.onSaveAs );
    ipcRenderer.removeAllListeners( E_MENU_EXPORT_PROJECT );
    ipcRenderer.on( E_MENU_EXPORT_PROJECT, this.onExportProject );
    ipcRenderer.removeAllListeners( E_MENU_EXIT_APP );
    ipcRenderer.on( E_MENU_EXIT_APP, this.onExit );
    ipcRenderer.removeAllListeners( E_MENU_RUN );
    ipcRenderer.on( E_MENU_RUN, this.onTestReport );
  }

  render() {
    const hotkeys = Object.keys( this.hotkeyMap ).join( ", " ),
          { projectDirectory, git, suiteFilename, readyToRunTests, files,
            gitDetachedHeadState } = this.props;

    return (
      <ErrorBoundary>
        <Hotkeys
          keyName={ hotkeys }
          onKeyDown={ this.onKeyDown }
        >
          <Menu id="cMainMenu"
            forceSubMenuRender={ Boolean( process.env.PUPPETRY_SPECTRON ) }
            theme="dark"
            mode="vertical"
            selectable={ false }>

            <SubMenu
              key="file"
              id="cMainMenuFile"
              title={<span><Icon type="file" /><span>File</span></span>}
            >
              <Menu.Item key="file1" onClick={ this.onNewProject } id="cMainMenuNewProject">
                New Project... { " " }<kbd>{ ostr( "Ctrl-Shift-N" ) }</kbd></Menu.Item>
              <Menu.Item key="file7" disabled={ !projectDirectory }
                onClick={ this.onSaveProjectAs } id="cMainMenuSaveProjectAs">
                Save Project As...</Menu.Item>
              <Menu.Item key="file2" disabled={ !projectDirectory }
                onClick={ this.onNewSuite } id="cMainMenuNewSuite">
                New Suite... { " " }<kbd>{ ostr( "Ctrl-N" ) }</kbd></Menu.Item>
              <Menu.Item key="file3" onClick={ this.onOpenProject } id="cMainMenuOpenProject">
                Open Project... { " " }<kbd>{ ostr( "Ctrl-Shift-O" ) }</kbd></Menu.Item>
              <Menu.Item key="file4" disabled={ !projectDirectory || !files.length  } id="cMainMenuOpenSuite"
                onClick={ this.onOpenSuite }>Open Suite...</Menu.Item>
              <Menu.Item key="file5" disabled={ !suiteFilename } onClick={ this.onSave } id="cMainMenuSaveSuite">
                Save Suite { " " }<kbd>{ ostr( "Ctrl-S" ) }</kbd></Menu.Item>
              <Menu.Item key="file6" disabled={ !suiteFilename } onClick={ this.onSaveAs } id="cMainMenuSaveAsSuite">
                Save Suite As...</Menu.Item>

              <SubMenu
                key="git"
                id="cMainMenuFileGit"
                title={<span><Icon type="branches" /><span>Git</span></span>}
              >
                <Menu.Item key="git1" disabled={ !suiteFilename || git.initialized }
                  onClick={ this.onFileGitInitialize } id="cMainMenuFileGitInit">
                  Initialize</Menu.Item>
                <Menu.Item key="git2" disabled={ !git.hasRemote }
                  onClick={ this.onFileGitClone } id="cMainMenuFileGitClone">
                  Clone...</Menu.Item>

                <Menu.Item key="git3" disabled={ !suiteFilename || !git.initialized || gitDetachedHeadState }
                  onClick={ this.onFileGitCheckout } id="cMainMenuFileGitCheckout">
                  Checkout...</Menu.Item>

                <Menu.Item key="git5" disabled={ !suiteFilename || !git.initialized || gitDetachedHeadState }
                  onClick={ this.onFileGitCommit }
                  id="cMainMenuFileGitCommit">Commit...{ " " }<kbd>{ ostr( "Ctrl-Shift-S" ) }</kbd></Menu.Item>
                <Menu.Item key="git6"
                  disabled={ !suiteFilename || !git.initialized || !git.hasRemote || gitDetachedHeadState }
                  onClick={ this.onFileGitSync } id="cMainMenuFileGitPull">
                  Sync with remote...</Menu.Item>

              </SubMenu>

              <Menu.Item key="7" disabled={ !projectDirectory } id="cMainMenuExportProject"
                onClick={ this.onExportProject }>
                Export Project for CI... { " " }<kbd>{ ostr( "Ctrl-Shift-E" ) }</kbd></Menu.Item>
              <Menu.Item key="8">Exit</Menu.Item>

            </SubMenu>

            <Menu.Item key="15" disabled={ !projectDirectory } onClick={ this.onSnippets } id="cMainMenuSnippets">
              <span><Icon type="snippets" /><span>Snippets</span></span></Menu.Item>

            <Menu.Item key="11" onClick={ this.onSettings } id="cMainMenuSettings">
              <span><Icon type="setting" /><span>Settings...</span></span></Menu.Item>

            <Menu.Item key="10"
              id="cMainMenuRun"
              className={ readyToRunTests ? "" : "is-not-ready" }
              disabled={ !projectDirectory } onClick={ readyToRunTests
                ? this.onTestReport : this.onRuntimeTestInstall }>
              <span><Icon type="right-square-o" /><span>Run... <kbd>F6</kbd></span></span>
            </Menu.Item>

          </Menu>
        </Hotkeys>
      </ErrorBoundary>
    );
  }
}