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
    action: PropTypes.shape({
      setProject: PropTypes.func.isRequired
    })
  }

  onTabChange = ( targetKey ) => {
    const panels = [ targetKey ];
    this.props.action.setProject({ panels });
  }

  render() {
    const { action, store } = this.props,
          targetsLabel = ( <span><Icon type="select" />Targets</span> ),
          groupsLabel = ( <span><Icon type="audit" />Groups</span> );
    let activeKey = "targets";
    if ( store.project.panels ) {
      [ activeKey ] = store.project.panels;
    }

    return (
      <ErrorBoundary>
        <div id="cMain">


          <Tabs
            activeKey={ activeKey }
            hideAdd={ true }
            animated={ false }
            onChange={ this.onTabChange }
          >
            <TabPane tab={ targetsLabel } key="targets" id="cSuitePanel">
              <p>Target constants used to address an element on the page.
              One can use DevTools to inspect the DOM and copy selectors</p>
              <TargetTable action={action} targets={store.suite.targets} />
            </TabPane>

            <TabPane tab={ groupsLabel } key="groups">
              <p>You can use drag&apos;n&apos;drop to re-arrange rows representing tests or test groups.</p>
              <GroupTable
                action={action}
                expanded={store.project.groups}
                groups={store.suite.groups}
                targets={store.suite.targets} />
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
