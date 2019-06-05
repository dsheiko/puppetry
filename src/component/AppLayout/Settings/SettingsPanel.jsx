import React from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import { GitPane } from "./Git/GitPane";
import { VariablesPane } from "./Variables/VariablesPane";
import ErrorBoundary from "component/ErrorBoundary";

const TabPane = Tabs.TabPane;

export class SettingsPanel extends React.Component {

  static propTypes = {
    project: PropTypes.object.isRequired,
    projectDirectory: PropTypes.string,
    git: PropTypes.object.isRequired,
    action: PropTypes.shape({
      updateProjectPanes: PropTypes.func.isRequired,
      setApp: PropTypes.func.isRequired
    })
  }

  onTabChange = ( targetKey ) => {
    this.props.action.setApp({ loading: true });
    setTimeout( () => {
      this.props.action.updateProjectPanes( "settings", [ targetKey ]);
      this.props.action.setApp({ loading: false });
    }, 10 );
  }

  render() {
    const { action, project, projectDirectory, git } = this.props,
          panes = project.appPanels.settings.panes;

    let activeKey = "variables";
    if ( panes.length ) {
      [ activeKey ] = panes;
    }

    return (
      <ErrorBoundary>
        <div id="cSettingsPanel" className="panes-container">

          <Tabs
            activeKey={ activeKey }
            hideAdd={ true }
            animated={ false }
            onChange={ this.onTabChange }
          >
            <TabPane tab="Variables" key="variables">
              <VariablesPane />
            </TabPane>

            <TabPane tab="GIT" key="git">
              <GitPane action={ action } git={ git } projectDirectory={ projectDirectory } />
            </TabPane>

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}
