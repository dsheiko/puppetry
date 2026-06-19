import React from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "component/ErrorBoundary";
import { ProjectExplorer } from "./ProjectExplorer";
import { OpenEditors } from "./OpenEditors";

export class Sider extends React.PureComponent {

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
          

          <OpenEditors
            open={ openEditorsOpen }
            onToggle={ this.toggleOpenEditors }
            suiteFilename={ suiteFilename }
            suiteModified={ suiteModified }
          />

          { projectFiles.length > 0 && <div className="vsc-explorer-separator" /> }

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
