import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon, Tooltip } from "antd";
import { Main } from "./AppLayout/Main";
import { Snippets } from "./AppLayout/Snippets";
import { SettingsPanel } from "./AppLayout/Settings/SettingsPanel";
import { VariablesPane } from "./AppLayout/Project/Variables/VariablesPane";
import { GitPane } from "./AppLayout/Project/Git/GitPane";
import { TargetsPane } from "./AppLayout/Project/Targets/TargetsPane";
import { TestReport } from "./AppLayout/TestReport";
import ErrorBoundary from "component/ErrorBoundary";
import { confirmUnsavedChanges } from "service/smalltalk";
import { connect } from "react-redux";

const TabPane = Tabs.TabPane,
      mapStateToProps = ( state ) => ({
        tabs:          state.app.tabs,
        suiteModified: state.suite.modified,
        suiteSnippets: state.suite.snippets,
        suiteFilename: state.suite.filename,
        suiteTitle:    state.suite.description || state.suite.title
      });

@connect( mapStateToProps )
export class TabGroup extends React.Component {

  static propTypes = {
    action: PropTypes.shape({
      removeAppTab: PropTypes.func.isRequired,
      setAppTab: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired
    }),
    selector: PropTypes.object,
    tabs: PropTypes.object,
    suiteModified: PropTypes.any,
    suiteSnippets: PropTypes.any,
    suiteFilename: PropTypes.any,
    suiteTitle: PropTypes.any
  }

  onEdit = ( targetKey, action ) => {
    this[ action ]( targetKey );
  }

  onChange = ( targetKey ) => {
    this.props.action.setAppTab( targetKey );
  }

  remove = async ( targetKey ) => {
    if ( targetKey === "suite" && this.props.suiteModified ) {
      await confirmUnsavedChanges({
        saveSuite: this.props.action.saveSuite,
        setSuite: this.props.action.setSuite
      });
    }
    this.props.action.removeAppTab( targetKey );
  }

  render() {
    const {
            action, selector, tabs, suiteTitle,
            suiteSnippets, suiteFilename
          } = this.props,

          suiteTabTitle = suiteFilename
            ? ( suiteSnippets
              ? "Shared Flows"
              :  <Tooltip placement="bottomRight" title={ suiteTitle }>
                <Icon type="container" />{ suiteFilename }
              </Tooltip> )
            : "Loading..." ,

          panes = {

            suite: () => ( <TabPane tab={ suiteTabTitle } key="suite" closable={ true }>
              { suiteSnippets && <Snippets action={ action } selector={ selector } /> }
              { !suiteSnippets && <Main
                action={ action }
                selector={ selector } /> }
            </TabPane> ),

            testReport: () => ( <TabPane tab="Test report"
              key="testReport" closable={ true } className="report-panel-tab">
              <TestReport
                action={ action }
                selector={ selector }
              />
            </TabPane> ),

            projectVariables: () => ( <TabPane tab={ "Template variables" } key="projectVariables" closable={ true }>
              <div className="tabpane-frame"><VariablesPane /></div>
            </TabPane> ),

            projectTargets: () => ( <TabPane tab={ "Shared Locators" } key="projectTargets" closable={ true }>
              <div className="tabpane-frame">
                <TargetsPane action={ action }  />
              </div>
            </TabPane> ),

            projectGit: () => ( <TabPane tab={ "GIT" } key="projectGit" closable={ true }>
              <div className="tabpane-frame">
                <GitPane action={ action } />
              </div>
            </TabPane> ),

            settings: () => ( <TabPane tab={ "Settings" } key="settings" closable={ true }>
              <SettingsPanel action={ action } />
            </TabPane> )
          };

    return (
      <ErrorBoundary>
        <Tabs
          className="c-tab-group-suite"
          hideAdd={ true }
          animated={ false }
          type="editable-card"
          activeKey={ tabs.active || "" }
          onChange={ this.onChange }
          onEdit={ this.onEdit }
        >

          { Object.keys( tabs.available )
            .filter( key => tabs.available[ key ])
            .map( key => panes[ key ]() ) }

        </Tabs>
      </ErrorBoundary>
    );
  }

}