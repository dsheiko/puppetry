import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { remote } from "electron";
import { confirmUnsavedChanges  } from "service/smalltalk";
import classNames from "classnames";
import { FileList } from "./ProjectExplorer/FileList";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const { Menu, MenuItem } = remote;

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        projectDirectory: state.settings.projectDirectory,
        projects: state.settings.projects,
        suiteModified: state.suite.modified,
        files: state.app.project.files,
        active: state.suite.filename 
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class ProjectExplorer extends React.PureComponent {
 
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
    clicked: ""
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
    
    window.consoleCount( __filename );

    if ( !projects.length ) {
      return <div></div>;
    }
    return (
      <ErrorBoundary>
        <div id="cProjectNavigator" className="project-navigator">
          <h2>Projects

            <a
              tabIndex={1} role="button"
              title="Create a project"
              className="project-navigator__open" onClick={ this.onNewProject }>
              <Icon type="folder-add" theme="filled" /></a>

            <a
              tabIndex={2} role="button"
              title="Add a project into the list"
              className="project-navigator__add" onClick={ this.onOpenProject }>
              <Icon type="folder-open" theme="filled" /></a>

          </h2>

          <nav className="project-navigator__nav">
            { projects.map( ( entity, inx ) => (

              <div
                key={ `d${inx}` }
                className={ classNames({
                  "project-navigator__selection": projectDirectory === entity.dir
                })}
              >
                <div
                  role="button"
                  tabIndex={0}
                  data-dir={ entity.dir }
                  onClick={ this.onClick }
                  onDoubleClick={ this.onDblClick }
                  onContextMenu={ this.onRightClick }
                  className={ classNames({
                    "project-navigator__li": true,
                    "is-clicked": this.state.clicked === entity.dir
                  }) }>
                  <Icon type={ projectDirectory === entity.dir
                    ? "folder-open" : "folder" } /> { entity.name }
                </div>
                { projectDirectory === entity.dir && <FileList
                  { ...this.props }
                  parentCliked={ this.state.clicked }
                  resetParentClicked={ this.resetParentClicked } /> }
              </div>

            ) ) }
          </nav>

        </div>
      </ErrorBoundary>
    );
  }
}
