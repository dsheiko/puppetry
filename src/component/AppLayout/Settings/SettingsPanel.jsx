import React from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import { GeneralPane } from "./General/GeneralPane";
import ErrorBoundary from "component/ErrorBoundary";

const TabPane = Tabs.TabPane;

export class SettingsPanel extends React.Component {

  static propTypes = {
    project: PropTypes.object.isRequired,
    settings: PropTypes.object,
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
    const { action, project, settings } = this.props,
          panes = project.appPanels.settings.panes;

    let activeKey = "general";
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

            <TabPane tab="General" key="general">
              <div className="subtabpane-frame">
                <GeneralPane action={ action } settings={ settings } />
              </div>
            </TabPane>

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}
