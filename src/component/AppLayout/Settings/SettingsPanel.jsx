import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon } from "antd";
import { GitPane } from "./Git/GitPane";
import ErrorBoundary from "component/ErrorBoundary";

const TabPane = Tabs.TabPane;

export class SettingsPanel extends React.Component {

  static propTypes = {
    panels: PropTypes.object.isRequired,
    action: PropTypes.shape({
      updateProjectPanes: PropTypes.func.isRequired
    })
  }

  onTabChange = ( targetKey ) => {
    this.props.action.updateApp({ loading: true });
    setTimeout(() => {
      this.props.action.updateProjectPanes( "settings", [ targetKey ] );
      this.props.action.updateApp({ loading: false });
    }, 10 );
  }

  render() {
   const { action, panels } = this.props,
          panes = panels.settings.panes;

    let activeKey = "git";
    if ( panes.length ) {
      [ activeKey ] = panes;
    }

    return (
      <ErrorBoundary>
        <div id="cSettingsPanel">

          <Tabs
            activeKey={ activeKey }
            hideAdd={ true }
            animated={ false }
            onChange={ this.onTabChange }
          >
            <TabPane tab="GIT" key="git">
              <GitPane />
            </TabPane>

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}
