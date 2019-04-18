import React from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import { Main } from "./AppLayout/Main";
import { SettingsPanel } from "./AppLayout/Settings/SettingsPanel";
import { TestReport } from "./AppLayout/TestReport";
import ErrorBoundary from "component/ErrorBoundary";
import { confirmUnsavedChanges } from "service/smalltalk";

const TabPane = Tabs.TabPane;

export class TabGroup extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      removeAppTab: PropTypes.func.isRequired,
      setAppTab: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired
    }),
    store: PropTypes.object.isRequired
  }

  onEdit = ( targetKey, action ) => {
    this[ action ]( targetKey );
  }

  onChange = ( targetKey ) => {
    this.props.action.setAppTab( targetKey );
  }

  remove = async ( targetKey ) => {
    if ( targetKey === "suite" && this.props.store.suite.modified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.removeAppTab( targetKey );
  }

  render() {
    const { store, action, selector } = this.props,
          { tabs } = store.app,
          { suite } = store,

          panes = {
            suite: () => ( <TabPane tab={ suite.filename || "Loading..." } key="suite" closable={ true }>
              <Main action={ action } store={ store } selector={ selector } />
            </TabPane> ),
            testReport: () => ( <TabPane tab="Test report" key="testReport" closable={ true }>
              <TestReport
                action={ action }
                targets={ store.suite.targets }
                projectDirectory={ store.settings.projectDirectory }
                headless={ store.app.headless }
                launcherArgs={ store.app.launcherArgs }
                checkedList={ store.app.checkedList } />
            </TabPane> ),
            settings: () => ( <TabPane tab={ "Settings" } key="settings" closable={ true }>
                <SettingsPanel
                  action={ action }
                  project={ store.project }
                  />
              </TabPane> )
          };

    return (
      <ErrorBoundary>
        <Tabs
          className="c-tab-group-suite"
          hideAdd={ true }
          animated={ false }
          type="editable-card"
          activeKey={ tabs.active || "" }
          onChange={ this.onChange }
          onEdit={ this.onEdit }
        >

          { Object.keys( tabs.available )
            .filter( key => tabs.available[ key ])
            .map( key => panes[ key ]() ) }

        </Tabs>
      </ErrorBoundary>
    );
  }

}