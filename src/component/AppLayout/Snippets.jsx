import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon } from "antd";
import { SnippetTable } from "./Main/GroupTable/SnippetTable";
import { SuiteForm  } from "./Main/SuiteForm";
import { TargetTable  } from "./Main/TargetTable";
import ErrorBoundary from "component/ErrorBoundary";
import { SNIPPETS_GROUP_ID } from "constant";

const TabPane = Tabs.TabPane;

export class Snippets extends React.Component {

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
          snippetsLabel = ( <span><Icon type="audit" />Snippets</span> ),
          group = store.suite.groups.hasOwnProperty( SNIPPETS_GROUP_ID )
            ? store.suite.groups[ SNIPPETS_GROUP_ID ] : null,
          tests = group ? selector.getTestDataTable( group ) : [],
          targets = Object.values( store.suite.targets );


    let activeKey = "targets";
    if ( panes.length ) {
      [ activeKey ] = panes;
    }

    return (
      <ErrorBoundary>
        <div id="cSnippets" className="panes-container">


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

            <TabPane tab={ snippetsLabel } key="groups">
              <p>Snippets are sequences of commands/asserts reusable across the project.</p>

              { tests && <SnippetTable
      expanded={ store.project.groups }
      targets={ targets }
      tests={ tests }
      groupId={ SNIPPETS_GROUP_ID }
      selector={ selector }
      action={ action } /> }

            </TabPane>

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}
