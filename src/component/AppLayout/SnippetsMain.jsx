import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon } from "antd";
import { SnippetCommandTable } from "./Main/GroupTable/TestTable/SnippetCommandTable";
import { TargetTable  } from "./Main/TargetTable";
import ErrorBoundary from "component/ErrorBoundary";
import { SNIPPETS_GROUP_ID } from "constant";
import AbstractForm from "component/AbstractForm";
import LearnMore from "component/Global/LearnMore";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        panes: state.project.appPanels.snippet.panes,
        targets: state.snippets.targets,
        targetDataTable: selectors.getSnippetsTargetDataTableMemoized( state )
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
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

  shouldComponentUpdate( nextProps ) {

    if ( this.props.snippetsTest !== nextProps.snippetsTest
      || this.props.panes !== nextProps.panes
      || this.props.targets !== nextProps.targets  ) {
      return true;
    }
    return false;
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
          commandsLabel = ( <span><Icon type="audit" />Commands</span> ),

          targetValues = Object.values( targets );

    console.count("SnippetsMain");

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
              <TargetTable action={ action } targets={ targetDataTable } model="SnippetsTarget" />
            </TabPane>

            <TabPane tab={ commandsLabel } key="groups">
              <p>Snippets are reusable test cases in scope of project. So you can
              create a snippet and refer to it in your test suites.<br />
              </p>
              <p><LearnMore href="https://docs.puppetry.app/snippets" /></p>



              <SnippetCommandTable
                commands={ snippetsTest.commands }
                targets={ targets }
                testId={ snippetsTest.id }
                groupId={ snippetsTest.groupId }
                selector={ this.props.selector }
                action={ this.props.action } />

            </TabPane>

          </Tabs>

        </div>
      </ErrorBoundary>
    );
  }
}
