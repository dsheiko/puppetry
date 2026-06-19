import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { remote } from "electron";
import { confirmUnsavedChanges  } from "service/smalltalk";
import classNames from "classnames";
import { FileList } from "./ProjectExplorer/FileList";

const { Menu, MenuItem } = remote;

export class ProjectExplorer extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      loadProject: PropTypes.func.isRequired,
      saveSettings: PropTypes.func.isRequired,
      removeSettingsProject: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired,
      setApp: PropTypes.func.isRequired,
      removeAppTab: PropTypes.func.isRequired,
      resetSuite: PropTypes.func.isRequired,
      resetProject: PropTypes.func.isRequired
    }),

    files: PropTypes.arrayOf( PropTypes.string ).isRequired,
    projectDirectory: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,

    active: PropTypes.string,
    suiteModified: PropTypes.bool
  }

  state = {
    clicked: "",
    open: true
  }

  toggleOpen = () => {
    this.setState( s => ({ open: !s.open }) );
  }

  onClick = ( e ) => {
    e.preventDefault();
    this.setState({ clicked: e.target.dataset.dir });
  }

  resetParentClicked = () => {
    this.setState({ clicked: "" });
  }

  onRightClick = ( e ) => {
    const dir = e.target.dataset.dir,
          { projectDirectory } = this.props,
          { loadProject,
            saveSettings, removeSettingsProject, removeAppTab, resetSuite, resetProject } = this.props.action,

          removeTheLastProject = () => {
            removeSettingsProject( dir );
            localStorage.setItem( "settings", "{}" );
            removeAppTab( "suite" );
            resetSuite();
            resetProject();
            saveSettings({ projectDirectory: "" });
          };

    e.preventDefault();

    if ( projectDirectory === dir ) {
      const menu = new Menu();

      menu.append( new MenuItem({
        label: "New Suite...",
        click: this.onNewSuite
      }) );

      menu.append( new MenuItem({
        label: "Delete from the list",
        click: async () => {

          if ( this.props.suiteModified ) {
            await confirmUnsavedChanges({
              saveSuite: this.props.action.saveSuite,
              setSuite: this.props.action.setSuite
            });
          }

          // If current project the only one, clean start
          const dirs = Object.keys( this.props.projects );
          if ( dirs.length < 2 ) {
            return removeTheLastProject();
          }
          // If more than one project than jump to it and remove last open
          const otherDir = dirs.find( d => d !== dir );
          removeSettingsProject( dir );
          saveSettings({ projectDirectory: otherDir });
          loadProject();
        }

      }) );
      menu.popup({
        x: e.x,
        y: e.y
      });
      return;
    }

    this.setState({ clicked: dir });

    const menu = new Menu();

    menu.on( "menu-will-close", () => {
      this.setState({ clicked: "" });
    });

    menu.append( new MenuItem({
      label: "Open",
      click: async () => {
        if ( this.props.suiteModified ) {
          await confirmUnsavedChanges({
            saveSuite: this.props.action.saveSuite,
            setSuite: this.props.action.setSuite
          });
        }
        saveSettings({ projectDirectory: dir });
        loadProject();
      }
    }) );

    menu.append( new MenuItem({
      label: "Delete from the list",
      click: async () => {
        removeSettingsProject( dir );
        setTimeout( saveSettings, 100 );
      }
    }) );
    menu.popup({
      x: e.x,
      y: e.y
    });
  }

  onDblClick = async ( e ) => {
    e.preventDefault();
    const { loadProject, saveSettings } = this.props.action,
          { projectDirectory } = this.props,
          dir = e.target.dataset.dir;

    if ( projectDirectory === dir ) {
      return;
    }

    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    saveSettings({ projectDirectory: dir });
    loadProject();
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


  render() {
    const { projectDirectory  } = this.props,
          projects = Object.entries( this.props.projects )
            .map( ([ dir, name ]) => ({ dir, name }) );

    if ( !projects.length ) {
      return <div></div>;
    }
    return (
      <ErrorBoundary>
        <div id="cProjectNavigator" className="vsc-explorer-section">
          <div
            className="vsc-explorer-section__header"
            role="button"
            tabIndex={0}
            onClick={ this.toggleOpen }
          >
            <Icon type={ this.state.open ? "caret-down" : "caret-right" } />
            Workspace
            <div className="vsc-explorer-section__actions">
              <a
                role="button"
                tabIndex={0}
                title="Create a test plan"
                className="vsc-explorer-section__action-btn"
                onClick={ e => { e.stopPropagation(); this.onNewProject(); } }
              >
                <Icon type="folder-add" />
              </a>
              <a
                role="button"
                tabIndex={0}
                title="Add a test plan to the workspace"
                className="vsc-explorer-section__action-btn"
                onClick={ e => { e.stopPropagation(); this.onOpenProject(); } }
              >
                <Icon type="folder-open" />
              </a>
            </div>
          </div>

          { this.state.open && (
            <nav className="project-navigator__nav">
              { projects.map( ( entity, inx ) => (
                <div key={ `d${inx}` }>
                  <div
                    role="button"
                    tabIndex={0}
                    data-dir={ entity.dir }
                    onClick={ this.onClick }
                    onDoubleClick={ this.onDblClick }
                    onContextMenu={ this.onRightClick }
                    className={ classNames({
                      "vsc-explorer-item": true,
                      "is-active": projectDirectory === entity.dir,
                      "is-clicked": this.state.clicked === entity.dir
                    }) }
                  >
                    <Icon type={ projectDirectory === entity.dir ? "folder-open" : "folder" } />
                    { entity.name }
                  </div>
                  { projectDirectory === entity.dir && (
                    <FileList
                      { ...this.props }
                      parentCliked={ this.state.clicked }
                      resetParentClicked={ this.resetParentClicked }
                    />
                  ) }
                </div>
              ) ) }
            </nav>
          ) }

        </div>
      </ErrorBoundary>
    );
  }
}
