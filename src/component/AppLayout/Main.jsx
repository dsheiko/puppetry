import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon } from "antd";
import { GroupTable  } from "./Main/GroupTable";
import { SuiteForm  } from "./Main/SuiteForm";
import { TargetTable  } from "./Main/TargetTable";
import ErrorBoundary from "component/ErrorBoundary";

const TabPane = Tabs.TabPane;

export class Main extends React.Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    selector: PropTypes.object.isRequired,
    action: PropTypes.shape({
      updateProjectPanes: PropTypes.func.isRequired,
      updateApp: PropTypes.func.isRequired
    })
  }

  onTabChange = ( targetKey ) => {
    this.props.action.updateApp({ loading: true });
    setTimeout( () => {
      this.props.action.updateProjectPanes( "suite", [ targetKey ]);
      this.props.action.updateApp({ loading: false });
    }, 10 );
  }

  render() {
    const { action, store, selector } = this.props,
          panes = store.project.appPanels.suite.panes,
          targetsLabel = ( <span><Icon type="select" />Targets</span> ),
          groupsLabel = ( <span><Icon type="audit" />Groups</span> );
    let activeKey = "targets";
    if ( panes.length ) {
      [ activeKey ] = panes;
    }

    return (
      <ErrorBoundary>
        <div id="cMain" className="panes-container">


          <Tabs
            activeKey={ activeKey }
            hideAdd={ true }
            animated={ false }
            onChange={ this.onTabChange }
          >
            <TabPane tab={ targetsLabel } key="targets" id="cSuitePane">
              <p>Target constants used to address an element on the page.
              One can use DevTools to inspect the DOM and copy selectors</p>
              <TargetTable action={action} targets={ selector.getTargetDataTable() } />
            </TabPane>

            <TabPane tab={ groupsLabel } key="groups">
              <p>You can use drag&apos;n&apos;drop to re-arrange rows representing tests or test groups.</p>
              <GroupTable
                action={ action }
                selector={ selector }
                expanded={ store.project.groups }
                groups={ selector.getGroupDataTable() }
                targets={ store.suite.targets } />
            </TabPane>

            <TabPane tab={ "Options" } key="options">
              <SuiteForm  action={action} title={ store.suite.title } timeout={ store.suite.timeout } />
            </TabPane>
            <TabPane tab={ "Expressions" } key="expression">
              <p>Expressions</p>
            </TabPane>
            <TabPane tab={ "Snippets" } key="snippets">
              <p>Snippets</p>
            </TabPane>

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}
