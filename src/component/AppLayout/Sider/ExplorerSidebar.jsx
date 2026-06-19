import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { ProjectExplorer } from "./ProjectExplorer";

export class ExplorerSidebar extends React.PureComponent {

  static propTypes = {
    action:           PropTypes.object.isRequired,
    projectDirectory: PropTypes.string,
    projects:         PropTypes.object.isRequired,
    projectFiles:     PropTypes.array.isRequired,
    suiteFilename:    PropTypes.string,
    suiteModified:    PropTypes.bool
  }

  state = {
    openEditorsOpen: true,
    projectOpen:     true
  }

  toggleOpenEditors = () => {
    this.setState( s => ({ openEditorsOpen: !s.openEditorsOpen }) );
  }

  toggleProject = () => {
    this.setState( s => ({ projectOpen: !s.projectOpen }) );
  }

  render() {
    const { openEditorsOpen, projectOpen } = this.state,
          { action, projectDirectory, projects, projectFiles,
            suiteFilename, suiteModified } = this.props;

    return (
      <ErrorBoundary>
        <div className="vsc-explorer" id="cExplorer">
          <div className="vsc-explorer-heading">Explorer</div>

          <div className="vsc-explorer-section">
            <div
              className="vsc-explorer-section__header"
              role="button"
              tabIndex={0}
              onClick={ this.toggleOpenEditors }
            >
              <Icon type={ openEditorsOpen ? "caret-down" : "caret-right" } />
              Open Editors
            </div>
            { openEditorsOpen && suiteFilename && (
              <div className="vsc-explorer-item is-active">
                <Icon type="file" />
                { suiteFilename }
                { suiteModified && <span className="vsc-explorer-item__dot" title="Unsaved changes">●</span> }
              </div>
            ) }
          </div>

          { projectFiles.length > 0 && projectOpen && (
              <ProjectExplorer
                projectDirectory={ projectDirectory }
                projects={ projects }
                suiteModified={ suiteModified }
                files={ projectFiles }
                active={ suiteFilename }
                action={ action }
              />
          ) }
        </div>
      </ErrorBoundary>
    );
  }
}
