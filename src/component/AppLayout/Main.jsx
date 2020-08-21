/*eslint jsx-a11y/no-static-element-interactions: 0*/
import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon } from "antd";
import { GroupTable  } from "./Main/GroupTable";
import { SuiteForm  } from "./Main/SuiteForm";
import { TargetTable  } from "./Main/TargetTable";
import { PageTable  } from "./Main/PageTable";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";
import LearnMore from "component/Global/LearnMore";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        panes: state.project.appPanels.suite.panes,
        expandedGroups: state.project.groups,
        groups: state.suite.groups,
        targets: state.suite.targets,
        title: state.suite.title,
        description: state.suite.description,
        timeout: state.suite.timeout,
        targetDataTable: selectors.getSuiteTargetDataTableMemoized( state ),
        groupDataTable: selectors.getSuiteGroupsMemoized( state )
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      }),
      KEY_TAB = 9,
      TabPane = Tabs.TabPane;

@connect( mapStateToProps, mapDispatchToProps )
export class Main extends AbstractComponent {

  static propTypes = {
    selector: PropTypes.object.isRequired,
    expandedGroups: PropTypes.object,
    groups: PropTypes.object,
    targets: PropTypes.object,
    timout: PropTypes.number,
    title: PropTypes.string,
    panes: PropTypes.array,
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

    if ( this.props.groups !== nextProps.groups
      || this.props.panes !== nextProps.panes
      || this.props.expandedGroups !== nextProps.expandedGroups
      || this.props.targets !== nextProps.targets
      || this.props.title !== nextProps.title
      || this.props.description !== nextProps.description
      || this.props.timeout !== nextProps.timeout ) {
      return true;
    }
    return false;
  }

  openTab = async ( tabKey, e = null ) => {
    e && e.preventDefault();
    this.props.action.addAppTab( tabKey );
  }

  panes = [ "groups", "targets", "options" ];

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
    let activeKey = "groups";
    if ( panes.length ) {
      [ activeKey ] = panes;
    }
    return activeKey;
  }

  render() {
    const { action,
            selector,
            expandedGroups,
            targets,
            title,
            description,
            timeout,
            targetDataTable,
            groupDataTable
          } = this.props,
          targetsLabel = ( <span><Icon type="select" />Targets</span> ),
          windowsLabel = ( <span><Icon type="appstore" />Windows</span> ),
          groupsLabel = ( <span><Icon type="audit" />Test Cases</span> ),
          optionsLabel = ( <span><Icon type="tool" />Suite Options</span> ),
          activeKey = this.getActivePane();

    window.consoleCount( __filename );

    return (
      <ErrorBoundary>
        <div id="cMain" className="panes-container">

          <Tabs
            className="tabgroup-suite"
            activeKey={ activeKey }
            hideAdd={ true }
            animated={ false }
            onChange={ this.onTabChange }
          >

            <TabPane tab={ groupsLabel } key="groups">
              <p>Test case is a specification of { "" }<a href="https://docs.puppetry.app/test-step"
                onClick={ this.onExtClick }>commands, assertions and references</a> { "" }
              to ensure that a targeted component of the test application acts as intended.
              Tests cases are organized into logical { "" } <a href="https://docs.puppetry.app/group"
                onClick={ this.onExtClick }>groups</a>, representing test contexts. During the test
                execution <a
                onClick={ this.onExtClick }
                href="https://pptr.dev/#?product=Puppeteer&version=v2.0.0&show=api-class-browser">
                a new browser session</a> is created for every group.
              </p>

              <p>
              You can change test case representation style in
                { " " }<a onClick={ ( e ) => this.openTab( "settings", e ) }>settings</a>.
              </p>
              <GroupTable
                action={ action }
                selector={ selector }
                expanded={ expandedGroups }
                groups={ groupDataTable }
                targets={ targets } />
            </TabPane>

            <TabPane tab={ targetsLabel } key="targets">
              <p>Targets are identifiers associated with locators (CSS selector or XPath)
              that we can refer in the test cases.
              </p>

              <p><LearnMore href="https://docs.puppetry.app/target" />
              </p>
              <TargetTable action={ action } targets={ targetDataTable } />
            </TabPane>

            <TabPane tab={ windowsLabel } key="windows">
               <p>Windows represent open browser windows and tabs.
              </p>
              <PageTable action={ action } />
            </TabPane>



            <TabPane tab={ optionsLabel } key="options">
              <SuiteForm  action={ action } title={ title } timeout={ timeout } description={ description } />
            </TabPane>

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}
