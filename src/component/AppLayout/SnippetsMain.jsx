import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon } from "antd";
import { SnippetTestTable } from "./Main/GroupTable/SnippetTestTable";
import { TargetTable  } from "./Main/TargetTable";
import ErrorBoundary from "component/ErrorBoundary";

import AbstractForm from "component/AbstractForm";
import LearnMore from "component/Global/LearnMore";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";
import actions from "action";
import { bindActionCreators } from "redux";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        panes: state.project.appPanels.snippet.panes,
        targets: state.snippets.targets,
        targetDataTable: selectors.getSnippetsTargetDataTableMemoized( state )
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      }),

      TabPane = Tabs.TabPane;

@connect( mapStateToProps, mapDispatchToProps )
export class SnippetsMain extends AbstractForm {

  static propTypes = {
    expandedGroups: PropTypes.object,
    groups: PropTypes.object,
    targets: PropTypes.object,
    panes: PropTypes.array,
    selector: PropTypes.object.isRequired,

    action: PropTypes.shape({
      updateProjectPanes: PropTypes.func.isRequired,
      setApp: PropTypes.func.isRequired
    })
  }

  onTabChange = ( targetKey ) => {
    this.props.action.setApp({ loading: true });
    setTimeout( () => {
      this.props.action.updateProjectPanes( "snippet", [ targetKey ]);
      this.props.action.setApp({ loading: false });
    }, 10 );
  }

  render() {
    const { action,
            selector,
            panes,
            snippetsTest,
            targets,
            targetDataTable
          } = this.props,

          targetsLabel = ( <span><Icon type="select" />Targets</span> ),
          testCasesLabel = ( <span><Icon type="audit" />Test Cases</span> );


    let activeKey = "targets";

    if ( panes.length ) {
      [ activeKey ] = panes;
    }

    window.consoleCount( __filename );

    return (
      <ErrorBoundary>
        <div id="cSnippets" className="panes-container">


          <Tabs
            activeKey={ activeKey }
            hideAdd={ true }
            animated={ false }
            onChange={ this.onTabChange }
          >

            <TabPane tab={ testCasesLabel } key="groups">
              <p>Snippets are reusable test cases in scope of project. So you can
              create a snippet and refer to it in your test suites.<br />
              </p>
              <p><LearnMore href="https://docs.puppetry.app/snippets" /></p>

              <SnippetTestTable />

            </TabPane>

            <TabPane tab={ targetsLabel } key="targets" id="cSuitePane">
              <p>Targets are identifiers associated with locators
              (CSS selector or XPath) that we can refer in the test cases.
              </p>

              <p><LearnMore href="https://docs.puppetry.app/target"/></p>
              <TargetTable action={ action } targets={ targetDataTable } model="SnippetsTarget" />
            </TabPane>

            

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}
