import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { remote } from "electron";

const { Menu, MenuItem } = remote;

export class ProjectNavigator extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired,
      openSuiteFileConfirm: PropTypes.func.isRequired,
      removeSuite: PropTypes.func.isRequired
    }),

    files: PropTypes.arrayOf( PropTypes.string ).isRequired,
    projectName: PropTypes.string.isRequired,
    active: PropTypes.string.isRequired
  }

  onClick = ( e ) => {
    e.preventDefault();
  }

  onDblClick = ( e ) => {
    const { openSuiteFileConfirm } = this.props.action,
          file = e.target.dataset.id;
    e.preventDefault();
    openSuiteFileConfirm( file );
  }

  onRightClick = ( e ) => {
    const file = e.target.dataset.id,
          { updateApp, openSuiteFileConfirm } = this.props.action;

    e.preventDefault();

    const menu = new Menu();

    menu.append( new MenuItem({
      label: "Open",
      click: () => {
        openSuiteFileConfirm( file );
      }
    }) );

    menu.append( new MenuItem({
      label: "Delete",
      click: () => {
        updateApp({ confirmDeleteModal: true, selectedFile: file });
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
                  className={ `${ active === file ? "is-active" : "" } project-navigator__li` }>
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
