import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { remote } from "electron";
import { confirmUnsavedChanges, confirmDeleteFile } from "service/smalltalk";
import classNames from "classnames";

const { Menu, MenuItem } = remote;

export class ProjectNavigator extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      openSuiteFile: PropTypes.func.isRequired,
      removeSuite: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired
    }),

    files: PropTypes.arrayOf( PropTypes.string ).isRequired,
    projectName: PropTypes.string.isRequired,
    active: PropTypes.string.isRequired,
    suiteModified: PropTypes.bool.isRequired
  }

  state = {
    dblClicked: ""
  }

  onClick = ( e ) => {
    e.preventDefault();
  }

  onDblClick = async ( e ) => {
    e.preventDefault();
    const { openSuiteFile } = this.props.action,
          file = e.target.dataset.id;

    if ( this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }

    openSuiteFile( file );
  }

  onRightClick = ( e ) => {
    const file = e.target.dataset.id,
          { openSuiteFile, removeSuite } = this.props.action;

    e.preventDefault();
    this.setState({ dblClicked: file });

    const menu = new Menu();

    menu.on( "menu-will-close", () => {
      this.setState({ dblClicked: "" });
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
      label: "Delete",
      click: async () => {
        const sure = await confirmDeleteFile( file );
        if ( sure ) {
          removeSuite( file );
        }
      }
    }) );
    menu.popup({
      x: e.x,
      y: e.y
    });
  }

  render() {
    const { projectName, files, active } = this.props;
    return (
      <ErrorBoundary>
        <div className="project-navigator">
          <h2>Project
            <span className="project-navigator__add"><Icon type="file-add" /></span>
          </h2>

          <nav className="project-navigator__nav">
            <div  className="project-navigator__li"><Icon type="folder-open" /> { projectName }</div>
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
                    "is-dbl-clicked": this.state.dblClicked ===  file
                  }) }>
                  <Icon type="file" /> { file }
                </li>
              ) ) }
            </ul>
          </nav>

        </div>
      </ErrorBoundary>
    );
  }
}
