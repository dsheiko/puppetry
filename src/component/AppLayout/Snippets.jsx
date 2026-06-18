import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon } from "antd";
import { SnippetTable } from "./Main/SnippetTable";
import { TargetTable  } from "./Main/TargetTable";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractForm from "component/AbstractForm";
import LearnMore from "component/Global/LearnMore";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";

const mapStateToProps = ( state ) => ({
        panes: state.project.appPanels.suite.panes,
        expandedTests: state.project.tests,
        tests: state.suite.tests,
        targets: state.suite.targets,
        targetDataTable: selectors.getSuiteTargetDataTableMemoized( state ),
        testDataTable: selectors.getSuiteTestsMemoized( state )
      }),
      mapDispatchToProps = () => ({
      }),

      TabPane = Tabs.TabPane;

@connect( mapStateToProps, mapDispatchToProps )
export class Snippets extends AbstractForm {

  static propTypes = {
    expandedTests: PropTypes.object,
    tests: PropTypes.object,
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
      this.props.action.updateProjectPanes( "suite", [ targetKey ]);
      this.props.action.setApp({ loading: false });
    }, 10 );
  }

  shouldComponentUpdate( nextProps ) {
    if ( this.props.tests !== nextProps.tests
      || this.props.panes !== nextProps.panes
      || this.props.expandedTests !== nextProps.expandedTests
      || this.props.targets !== nextProps.targets ) {
      return true;
    }
    return false;
  }

  render() {
    const { action,
            selector,
            panes,
            expandedTests,
            targets,
            targetDataTable,
            testDataTable
          } = this.props,

          targetsLabel = ( <span><Icon type="select" />Locators</span> ),
          snippetsLabel = ( <span><Icon type="audit" />Shared Flows</span> ),
          targetValues = Object.values( targets );

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
              <p>Locators are identifiers associated with selectors
              (CSS selector or XPath) that we can refer in the test cases.
              </p>

              <p><LearnMore href="https://docs.puppetry.app/target"/></p>
              <TargetTable action={ action } targets={ targetDataTable } />
            </TabPane>

            <TabPane tab={ snippetsLabel } key="tests">
              <p>Shared Flows are reusable sequences of steps in scope of a test plan. So you can
              create a shared flow and refer to it in your test suites.<br />
              </p>
              <p><LearnMore href="https://docs.puppetry.app/snippets" /></p>

              <SnippetTable
                expanded={ expandedTests }
                targets={ targetValues }
                tests={ testDataTable }
                selector={ selector }
                action={ action } />

            </TabPane>

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}
