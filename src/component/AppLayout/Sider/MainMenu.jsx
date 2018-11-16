import React from "react";
import PropTypes from "prop-types";
import { Menu, Icon } from "antd";
import { ipcRenderer } from "electron";
import Hotkeys from "react-hot-keys";
import ErrorBoundary from "component/ErrorBoundary";
import { msgDataSaved } from "component/Global/Message";
import { confirmUnsavedChanges } from "service/smalltalk";
import { E_MENU_NEW_PROJECT, E_MENU_NEW_SUITE,
  E_MENU_OPEN_PROJECT, E_MENU_SAVE_SUITE, E_MENU_SAVE_SUITE_AS,
  E_MENU_OPEN_SUITE, E_MENU_EXPORT_PROJECT, E_MENU_EXIT_APP, E_MENU_RUN } from "constant";


const SubMenu = Menu.SubMenu,
      isMac = process.platform === "win32",
      ostr = ( kbd ) => {
        if ( !isMac ) {
          return kbd;
        }
        return kbd.replace( "Ctrl", "⌘" );
      };

export class MainMenu extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired,
      closeApp: PropTypes.func.isRequired
    }),
    readyToRunTests: PropTypes.bool.isRequired,
    projectDirectory: PropTypes.string.isRequired,
    suiteFilename: PropTypes.string.isRequired,
    suiteModified: PropTypes.bool.isRequired
  }


  hotkeyMap = {
    "ctrl+s": "onSave",
    "command+s": "onSave",

    "ctrl+n": "onNewSuite",
    "command+n": "onNewSuite",

    "ctrl+shift+n": "onNewProject",
    "command+shift+n": "onNewProject",

    "ctrl+shift+p": "onOpenProject",
    "command+shift+p": "onOpenProject",

    "ctrl+shift+e": "onExportProject",
    "command+shift+e": "onExportProject",

    "f6": "onTestReport"
  }

  onKeyDown = ( keyNm, e ) => {
    if ( this.hotkeyMap.hasOwnProperty( keyNm ) ) {
      this[ this.hotkeyMap[ keyNm ] ]( e );
    }
  }

  onSave = () => {
    const { suiteFilename } = this.props;
    if ( !suiteFilename ) {
      return this.onSaveAs();
    }
    this.props.action.saveSuite();
    msgDataSaved();
  }

  onSaveAs = () => {
    this.props.action.updateApp({ saveSuiteAsModal: true });
  }

  onNewProject = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.updateApp({ newProjectModal: true });
  }

  onOpenProject = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.updateApp({ openProjectModal: true });
  }

  onOpenSuite = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.updateApp({ openSuiteModal: true });
  }

  onNewSuite = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.updateApp({ newSuiteModal: true });
  }

  onTestReport = async () => {
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.updateApp({ testReportModal: true });
  }

  onRuntimeTestInstall = () => {
    this.props.action.updateApp({ installRuntimeTestModal: true });
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
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    return this.props.action.updateApp({ exportProjectModal: true });
  }

  componentDidMount() {
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
          { projectDirectory, suiteFilename, readyToRunTests } = this.props;
    return (
      <ErrorBoundary>
        <Hotkeys
          keyName={ hotkeys }
          onKeyDown={ this.onKeyDown }
        >
          <Menu theme="dark"  mode="vertical">

            <SubMenu
              key="sub1"
              title={<span><Icon type="file" /><span>File</span></span>}
            >
              <Menu.Item key="1" onClick={ this.onNewProject }>
                New Project... { " " }<kbd>{ ostr( "Ctrl-Shift-N" ) }</kbd></Menu.Item>
              <Menu.Item key="2" disabled={ !projectDirectory } onClick={ this.onNewSuite }>
                New Suite... { " " }<kbd>{ ostr( "Ctrl-N" ) }</kbd></Menu.Item>
              <Menu.Item key="3" onClick={ this.onOpenProject }>
                Open Project... { " " }<kbd>{ ostr( "Ctrl-Shift-O" ) }</kbd></Menu.Item>
              <Menu.Item key="4" disabled={ !suiteFilename } onClick={ this.onSave }>
                Save Suite { " " }<kbd>{ ostr( "Ctrl-S" ) }</kbd></Menu.Item>
              <Menu.Item key="5" disabled={ !suiteFilename } onClick={ this.onSaveAs }>
                Save Suite As...</Menu.Item>
              <Menu.Item key="6" disabled={ !projectDirectory } onClick={ this.onOpenSuite }>Open Suite...</Menu.Item>
              <Menu.Item key="7" disabled={ !projectDirectory } onClick={ this.onExportProject }>
                Export Project... { " " }<kbd>{ ostr( "Ctrl-Shift-E" ) }</kbd></Menu.Item>
              <Menu.Item key="8">Exit</Menu.Item>

            </SubMenu>
            <Menu.Item key="1"
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