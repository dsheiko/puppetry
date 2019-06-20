import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon } from "antd";
import { GroupTable  } from "./Main/GroupTable";
import { SuiteForm  } from "./Main/SuiteForm";
import { TargetTable  } from "./Main/TargetTable";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";
import LearnMore from "component/Global/LearnMore";

const TabPane = Tabs.TabPane;

export class Main extends AbstractComponent {

  static propTypes = {
    store: PropTypes.object.isRequired,
    selector: PropTypes.object.isRequired,
    action: PropTypes.shape({
      updateProjectPanes: PropTypes.func.isRequired,
      setApp: PropTypes.func.isRequired
    })
  }

  onTabChange = ( targetKey ) => {
    this.props.action.setApp({ loading: true });
    setTimeout( () => {
      this.props.action.updateProjectPanes( "suite", [ targetKey ]);
      this.props.action.setApp({ loading: false });
    }, 10 );
  }

  render() {
    const { action, store, selector } = this.props,
          panes = store.project.appPanels.suite.panes,
          targetsLabel = ( <span><Icon type="select" />Targets</span> ),
          groupsLabel = ( <span><Icon type="audit" />Test Cases</span> );
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
              <p>Targets are identifiers associated with locators (CSS selector or XPath) that we can refer in the test cases.
              </p>
              <p><LearnMore href="https://docs.puppetry.app/target" />
              </p>
              <TargetTable action={action} targets={ selector.getTargetDataTable() } />
            </TabPane>

            <TabPane tab={ groupsLabel } key="groups">
              <p>Test case is a specification of { "" }<a href="https://docs.puppetry.app/test-step" onClick={ this.onExtClick }>commands, assertions and references</a> { "" }
              to ensure that a targeted component of the test application acts as intended.
              Tests cases are organised into logical { "" } <a href="https://docs.puppetry.app/group" onClick={ this.onExtClick }>groups</a> { "" }, representing test contexts.</p>

              <p>You can use { "" } <a href="https://docs.puppetry.app/managing-assets#drag-and-drop" onClick={ this.onExtClick }>drag&apos;n&apos;drop</a> { "" } to re-arrange rows representing groups/test cases/test steps.</p>
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

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}
