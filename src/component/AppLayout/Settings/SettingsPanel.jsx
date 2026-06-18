import React from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import { GeneralPane } from "./General/GeneralPane";
import ErrorBoundary from "component/ErrorBoundary";
import { connect } from "react-redux";

const TabPane = Tabs.TabPane,
      mapStateToProps = ( state ) => ({
        settings:      state.settings,
        settingsPanes: state.project.appPanels.settings.panes
      });

@connect( mapStateToProps )
export class SettingsPanel extends React.Component {

  static propTypes = {
    settings: PropTypes.object,
    settingsPanes: PropTypes.array,
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
    const { action, settings, settingsPanes: panes } = this.props;

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
