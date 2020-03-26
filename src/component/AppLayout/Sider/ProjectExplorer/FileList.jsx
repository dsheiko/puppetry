import React from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "component/ErrorBoundary";
import { remote } from "electron";
import { confirmUnsavedChanges, confirmDeleteFile } from "service/smalltalk";
import classNames from "classnames";
import { FileOutlined } from "@ant-design/icons";

const { Menu, MenuItem } = remote;

export class FileList extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      openSuiteFile: PropTypes.func.isRequired,
      removeSuite: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired,
      removeAppTab: PropTypes.func.isRequired,
      setApp: PropTypes.func.isRequired,
      autosaveProject: PropTypes.func.isRequired
    }),

    parentCliked: PropTypes.string.isRequired,
    resetParentClicked: PropTypes.func.isRequired,

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
    this.props.resetParentClicked();
    this.setState({ clicked: e.target.dataset.id });
  }

  onDblClick = async ( e ) => {
    e.preventDefault();
    const { openSuiteFile, autosaveProject } = this.props.action,
          file = e.target.dataset.id;

    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }

    openSuiteFile( file );
    autosaveProject();
  }

  onRightClick = ( e ) => {
    const file = e.target.dataset.id,
          { openSuiteFile, removeSuite } = this.props.action;

    e.preventDefault();
    this.props.resetParentClicked();
    this.setState({ clicked: file });

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
        openSuiteFile( file );
      }
    }) );

    menu.append( new MenuItem({
      label: "Save as...",
      click: this.onSaveSuiteAs
    }) );

    menu.append( new MenuItem({
      label: "Delete",
      click: async () => {
        const sure = await confirmDeleteFile( file );
        if ( sure ) {
          if ( file === this.props.active ) {
            this.props.action.removeAppTab( "suite" );
          }
          removeSuite( file );
        }
      }
    }) );
    menu.popup({
      x: e.x,
      y: e.y
    });
  }

  onSaveSuiteAs = () => {
    const { projectDirectory } = this.props;
    if ( !projectDirectory ) {
      return;
    }
    this.props.action.setApp({ saveSuiteAsModal: true });
  }

  render() {
    const { files, active, parentCliked } = this.props;
    return (
      <ErrorBoundary>
        <ul>
          { files.map( ( file, inx ) => (
            <li key={ `f${inx}` }
              onClick={ this.onClick }
              onDoubleClick={ this.onDblClick }
              onContextMenu={ this.onRightClick }
              data-id={ file }
              className={ classNames({
                "project-navigator__li": true,
                "is-active": active === file,
                "is-clicked": parentCliked ==="" && this.state.clicked ===  file
              }) }>
              <FileOutlined /> { file }
            </li>
          ) ) }
        </ul>
      </ErrorBoundary>
    );
  }
}
