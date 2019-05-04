import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { remote } from "electron";
import { confirmUnsavedChanges, confirmDeleteFile } from "service/smalltalk";
import classNames from "classnames";
import { FileList } from "./ProjectExplorer/FileList";

const { Menu, MenuItem } = remote;

export class ProjectExplorer extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      openSuiteFile: PropTypes.func.isRequired,
      removeSuite: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired
    }),

    files: PropTypes.arrayOf( PropTypes.string ).isRequired,
    projectDirectory: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,

    active: PropTypes.string.isRequired,
    suiteModified: PropTypes.bool.isRequired
  }

  state = {
    clicked: ""
  }

  onClick = ( e ) => {
    e.preventDefault();
    //this.setState({ clicked: e.target.dataset.dir });
  }

  onRightClick = ( e ) => {
    const dir = e.target.dataset.dir,
          { openSuiteFile, removeSuite } = this.props.action;

    e.preventDefault();
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
          dir = e.target.dataset.dir;

    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    saveSettings({ projectDirectory: dir });
    loadProject();
  }



  render() {
    const { projectDirectory, files, active, action } = this.props,
          projects = Object.entries( this.props.projects )
            .map(([ dir, name ]) => ({ dir, name }));
    return (
      <ErrorBoundary>
        <div id="cProjectNavigator" className="project-navigator">
          <h2>Project
            <span className="project-navigator__add"></span>
          </h2>

          <nav className="project-navigator__nav">
            { projects.map( ( entity, inx ) => (

              <div
                key={ `d${inx}` }
                className="project-navigator__li">
                <span
                  data-dir={ entity.dir }
                  onClick={ this.onClick }
                  onDoubleClick={ this.onDblClick }
                  onContextMenu={ this.onRightClick }
                  className={ classNames({
                  "is-clicked": this.state.clicked === entity.dir
                    }) }>
                <Icon type={ projectDirectory === entity.dir
                ? "folder-open" : "folder" } /> { entity.name }</span>
                { projectDirectory === entity.dir && <FileList
                  { ...this.props } /> }
              </div>

           )) }
          </nav>

        </div>
      </ErrorBoundary>
    );
  }
}
