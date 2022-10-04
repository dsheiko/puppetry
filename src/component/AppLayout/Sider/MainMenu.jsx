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
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const SubMenu = Menu.SubMenu;

// Mapping state to the props
const mapStateToProps = ( state ) => {
        const projectDirectory = state.settings;
        return {
          isProjectEmpty: !state.app.project.files.length,
          isSuiteOpen: !!state.suite.filename,
          projectDirectory: projectDirectory,
          isProjectOpen: !!projectDirectory,
          suiteModified: !!state.suite.modified,
          readyToRunTests: !!state.app.readyToRunTests
        };
      },
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class MainMenu extends React.PureComponent {

  whyDidYouRender = true;

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
    const { isSuiteOpen, isProjectOpen } = this.props;
    if ( !isProjectOpen ) {
      return;
    }
    if ( !isSuiteOpen ) {
      return this.onSaveAs();
    }
    this.props.action.saveSuite();
    msgDataSaved();
  }

  onSaveAs = () => {
    const { isProjectOpen } = this.props;
    if ( !isProjectOpen ) {
      return;
    }
    this.props.action.setApp({ saveSuiteAsModal: true });
  }

  onSaveProjectAs = () => {
    const { isProjectOpen } = this.props;
    if ( !isProjectOpen ) {
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
    const { isProjectOpen, isProjectEmpty } = this.props;
    if ( !isProjectOpen || isProjectEmpty ) {
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
    const { isProjectOpen } = this.props;
    if ( !isProjectOpen ) {
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

  onRuntimeTestInstall = async () => {
    const { isProjectOpen } = this.props;
    if ( !isProjectOpen ) {
      return;
    }
    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
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
    const { isProjectOpen } = this.props;
    if ( !isProjectOpen ) {
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
    const { openSuiteFile, saveSuite, setSuite, autosaveProject } = this.props.action;

    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite,
        setSuite
      });
    }

    openSuiteFile( SNIPPETS_FILENAME );
    autosaveProject();
  }

  openTab = async ( tabKey ) => {
    this.props.action.addAppTab( tabKey );
  }

  onRendererInfo( ev, msg ) {
    message.info( msg );
  }

  onRendererError( ev, msg ) {
    this.props.action.setApp({ loading: false });
    message.error( msg );
  }

  componentDidMount() {
    ipcRenderer.removeAllListeners( E_RENDERER_INFO );
    ipcRenderer.on( E_RENDERER_INFO, this.onRendererInfo );
    ipcRenderer.removeAllListeners( E_RENDERER_ERROR );
    ipcRenderer.on( E_RENDERER_ERROR, ( ev, msg ) => this.onRendererError( ev, msg ) );
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
          { isProjectOpen, isSuiteOpen, readyToRunTests, isProjectEmpty } = this.props;
     
    window.consoleCount( __filename );

    return (
      <ErrorBoundary>
        <Hotkeys
          keyName={ hotkeys }
          onKeyDown={ this.onKeyDown }
        >
          <Menu id="cMainMenu"
            forceSubMenuRender={ true }
            mode="horizontal"
            selectable={ false }>

            <SubMenu
              key="file"
              id="cMainMenuFile"
              title={<span><Icon type="file" /><span>File</span></span>}
            >
              <Menu.Item key="file1" onClick={ this.onNewProject } id="cMainMenuNewProject">
                New Project... { " " }<kbd>{ ostr( "Ctrl-Shift-N" ) }</kbd></Menu.Item>
              <Menu.Item key="file7" disabled={ !isProjectOpen }
                onClick={ this.onSaveProjectAs } id="cMainMenuSaveProjectAs">
                Save Project As...</Menu.Item>
              <Menu.Item key="file2" disabled={ !isProjectOpen }
                onClick={ this.onNewSuite } id="cMainMenuNewSuite">
                New Suite... { " " }<kbd>{ ostr( "Ctrl-N" ) }</kbd></Menu.Item>
              <Menu.Item key="file3" onClick={ this.onOpenProject } id="cMainMenuOpenProject">
                Open Project... { " " }<kbd>{ ostr( "Ctrl-Shift-O" ) }</kbd></Menu.Item>
              <Menu.Item key="file4" disabled={ !isProjectOpen || isProjectEmpty  } id="cMainMenuOpenSuite"
                onClick={ this.onOpenSuite }>Open Suite...</Menu.Item>
              <Menu.Item key="file5" disabled={ !isSuiteOpen } onClick={ this.onSave } id="cMainMenuSaveSuite">
                Save Suite { " " }<kbd>{ ostr( "Ctrl-S" ) }</kbd></Menu.Item>
              <Menu.Item key="file6" disabled={ !isSuiteOpen } onClick={ this.onSaveAs } id="cMainMenuSaveAsSuite">
                Save Suite As...</Menu.Item>


              <Menu.Item key="7" disabled={ !isProjectOpen } id="cMainMenuExportProject"
                onClick={ this.onExportProject }>
                Export Project as... { " " }<kbd>{ ostr( "Ctrl-Shift-E" ) }</kbd></Menu.Item>
              <Menu.Item key="8">Exit</Menu.Item>

            </SubMenu>

            <Menu.Item key="11" onClick={ () => this.openTab( "settings" ) } id="cMainMenuSettings">
              <span><Icon type="setting" /><span>Settings</span></span></Menu.Item>

            <Menu.Item key="10"
              id="cMainMenuRun"
              className={ readyToRunTests ? "" : "is-not-ready" }
              disabled={ !isProjectOpen } onClick={ readyToRunTests
                ? this.onTestReport : this.onRuntimeTestInstall }>
              <span><Icon type="right-square-o" /><span>Run... <kbd>F6</kbd></span></span>
            </Menu.Item>

          </Menu>
        </Hotkeys>
      </ErrorBoundary>
    );
  }
}