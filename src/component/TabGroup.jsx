import React from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import { Main } from "./AppLayout/Main";
import { TestReport } from "./AppLayout/TestReport";
import ErrorBoundary from "component/ErrorBoundary";

const TabPane = Tabs.TabPane;

export class TabGroup extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      removeAppTab: PropTypes.func.isRequired,
      setAppTab: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired
    }),
    store: PropTypes.object.isRequired
  }

  onEdit = ( targetKey, action ) => {
    this[ action ]( targetKey );
  }

  onChange = ( targetKey ) => {
    this.props.action.setAppTab( targetKey );
  }

  remove = ( targetKey ) => {
    // @TODO remove with Confirm dialog
    targetKey === "suite" && this.props.action.saveSuite();
    this.props.action.removeAppTab( targetKey );
  }

  render() {
    const { store, action } = this.props,
          { tabs } = store.app,
          { suite } = store,

          panes = {
            suite: () => ( <TabPane tab={ suite.filename || "Loading..." } key="suite" closable={ true }>
              <Main action={ action } store={ store } />
            </TabPane> ),
            testReport: () => ( <TabPane tab="Test report" key="testReport" closable={ true }>
              <TestReport
                action={ action }
                targets={ store.suite.targets }
                projectDirectory={ store.settings.projectDirectory }
                checkedList={ store.app.checkedList } />
            </TabPane> )
          };

    return (
      <ErrorBoundary>
        <Tabs
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