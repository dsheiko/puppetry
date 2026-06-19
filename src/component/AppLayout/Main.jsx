/*eslint jsx-a11y/no-static-element-interactions: 0*/
import React from "react";
import PropTypes from "prop-types";
import { Button, Drawer, Icon, Tabs } from "antd";
import { TestTable  } from "./Main/TestTable";
import { SuiteForm  } from "./Main/SuiteForm";
import { TargetTable  } from "./Main/TargetTable";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";
import LearnMore from "component/Global/LearnMore";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";

const mapStateToProps = ( state ) => ({
        panes: state.project.appPanels.suite.panes,
        expandedTests: state.project.tests,
        tests: state.suite.tests,
        targets: state.suite.targets,
        title: state.suite.title,
        description: state.suite.description,
        timeout: state.suite.timeout,
        targetDataTable: selectors.getSuiteTargetDataTableMemoized( state ),
        testDataTable: selectors.getSuiteTestsMemoized( state )
      }),
      mapDispatchToProps = () => ({
      }),
      KEY_TAB = 9,
      TabPane = Tabs.TabPane;

@connect( mapStateToProps, mapDispatchToProps )
export class Main extends AbstractComponent {

  static propTypes = {
    selector: PropTypes.object.isRequired,
    expandedTests: PropTypes.object,
    tests: PropTypes.object,
    targets: PropTypes.object,
    timeout: PropTypes.number,
    title: PropTypes.string,
    panes: PropTypes.array,
    action: PropTypes.shape({
      updateProjectPanes: PropTypes.func.isRequired,
      setApp: PropTypes.func.isRequired
    })
  }

  state = {
    suiteOptionsOpen: false
  }

  openSuiteOptions = () => {
    this.setState({ suiteOptionsOpen: true });
  }

  closeSuiteOptions = () => {
    this.setState({ suiteOptionsOpen: false });
  }

  onTabChange = ( targetKey ) => {
    this.props.action.updateProjectPanes( "suite", [ targetKey ] );
  }

  shouldComponentUpdate( nextProps, nextState ) {
    if ( this.props.tests !== nextProps.tests
      || this.props.panes !== nextProps.panes
      || this.props.expandedTests !== nextProps.expandedTests
      || this.props.targets !== nextProps.targets
      || this.props.title !== nextProps.title
      || this.props.description !== nextProps.description
      || this.props.timeout !== nextProps.timeout
      || this.state.suiteOptionsOpen !== nextState.suiteOptionsOpen ) {
      return true;
    }
    return false;
  }

  panes = [ "targets", "tests" ];

  onKeyDown = ( e ) => {
    if ( e.keyCode === KEY_TAB && e.ctrlKey ) {
      const activeKey = this.getActivePane(),
            index = this.panes.indexOf( activeKey ) + 1,
            nextKey = typeof this.panes[ index ] === "undefined" ? this.panes[ 0 ] : this.panes[ index ];
      this.props.action.updateProjectPanes( "suite", [ nextKey ]);
    }
  }

  componentDidMount() {
    document.addEventListener( "keydown", this.onKeyDown, false );
  }

  componentWillUnmount() {
    document.removeEventListener( "keydown", this.onKeyDown );
  }

  getActivePane() {
    const { panes  } = this.props;
    let activeKey = "targets";
    if ( panes.length ) {
      [ activeKey ] = panes;
    }
    return activeKey;
  }

  render() {
    const { action,
            selector,
            expandedTests,
            targets,
            title,
            description,
            timeout,
            targetDataTable,
            testDataTable
          } = this.props,
          { suiteOptionsOpen } = this.state,
          activeKey = this.getActivePane(),
          targetsLabel = ( <span><Icon type="select" />Locators</span> ),
          testsLabel = ( <span><Icon type="audit" />Test Cases</span> ),
          suiteOptionsBtn = (
            <Button size="small" onClick={ this.openSuiteOptions }>
              <Icon type="setting" />{ " " }Suite options
            </Button>
          );

    return (
      <ErrorBoundary>
        <div id="cMain" className="panes-container">

          <Tabs
            className="tabgroup-suite"
            activeKey={ activeKey }
            hideAdd={ true }
            animated={ false }
            onChange={ this.onTabChange }
            tabBarExtraContent={ suiteOptionsBtn }
          >
            <TabPane tab={ targetsLabel } key="targets">
              <p>Locators are identifiers associated with selectors (CSS selector or XPath)
              that we can refer in the test cases.
              </p>

              <TargetTable action={ action } targets={ targetDataTable } />
            </TabPane>

            <TabPane tab={ testsLabel } key="tests">
              <TestTable
                action={ action }
                selector={ selector }
                expanded={ expandedTests }
                tests={ testDataTable }
                targets={ targets } />
            </TabPane>

          </Tabs>

          <Drawer
            title="Suite options"
            width={ 400 }
            visible={ suiteOptionsOpen }
            onClose={ this.closeSuiteOptions }
          >
            <SuiteForm action={ action } title={ title } timeout={ timeout } description={ description } />
          </Drawer>

        </div>
      </ErrorBoundary>
    );
  }
}
