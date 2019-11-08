import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon } from "antd";
import { SnippetTable } from "./Main/GroupTable/SnippetTable";
import { TargetTable  } from "./Main/TargetTable";
import ErrorBoundary from "component/ErrorBoundary";
import { SNIPPETS_GROUP_ID } from "constant";
import AbstractForm from "component/AbstractForm";
import LearnMore from "component/Global/LearnMore";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        panes: state.project.appPanels.suite.panes,
        expandedGroups: state.project.groups,
        groups: state.suite.groups,
        targets: state.suite.targets,
        targetDataTable: selectors.getSuiteTargetDataTableMemoized( state )
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      }),

      TabPane = Tabs.TabPane;

@connect( mapStateToProps, mapDispatchToProps )
export class Snippets extends AbstractForm {

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
      || this.props.timeout !== nextProps.timeout ) {
      return true;
    }
    return false;
  }

  render() {
    const { action,
            selector,
            panes,
            groups,
            expandedGroups,
            targets,
            targetDataTable
          } = this.props,

          targetsLabel = ( <span><Icon type="select" />Targets</span> ),
          snippetsLabel = ( <span><Icon type="audit" />Snippets</span> ),
          group = groups.hasOwnProperty( SNIPPETS_GROUP_ID )? groups[ SNIPPETS_GROUP_ID ] : null,
          tests = group ? selector.getTestDataTable( group ) : [],
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
              <p>Targets are identifiers associated with locators
              (CSS selector or XPath) that we can refer in the test cases.
              </p>

              <p><LearnMore href="https://docs.puppetry.app/target"/></p>
              <TargetTable action={action} targets={ targetDataTable } />
            </TabPane>

            <TabPane tab={ snippetsLabel } key="groups">
              <p>Snippets are reusable test cases in scope of project. So you can
              create a snippet and refer to it in your test suites.<br />
              </p>
              <p><LearnMore href="https://docs.puppetry.app/snippets" /></p>

              { tests && <SnippetTable
                expanded={ expandedGroups }
                targets={ targetValues }
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
