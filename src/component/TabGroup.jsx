import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon, Tooltip } from "antd";
import { Main } from "./AppLayout/Main";
import { SnippetsMain } from "./AppLayout/SnippetsMain";
import { SettingsPanel } from "./AppLayout/Settings/SettingsPanel";
import { VariablesPane } from "./AppLayout/Project/Variables/VariablesPane";
import { GitPane } from "./AppLayout/Project/Git/GitPane";
import { TargetsPane } from "./AppLayout/Project/Targets/TargetsPane";
import { TestReport } from "./AppLayout/TestReport";
import ErrorBoundary from "component/ErrorBoundary";
import { confirmUnsavedChanges } from "service/smalltalk";
import { truncate } from "service/utils";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";

const TabPane = Tabs.TabPane,
      TAB_TEXT_MAX_LEN = 16,
      // Mapping state to the props
      mapStateToProps = ( state, props ) => ({
        projectDirectory: state.settings.projectDirectory,
        app: state.app,
        suiteModified: state.suite.modified,
        suiteSnippets: state.suite.snippets,
        suiteTargets: state.suite.targets,
        suiteFilename: state.suite.filename,
        suiteTitle: state.suite.description || state.suite.title,
        project: state.project,
        git: state.git,
        settings: state.settings,
        snippetsTest: selectors.getSnippetsTestMemoized( state, props )
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      });
/*eslint react/prop-types: 0*/
@connect( mapStateToProps, mapDispatchToProps )
export class TabGroup extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      removeAppTab: PropTypes.func.isRequired,
      setAppTab: PropTypes.func.isRequired,
      saveSuite: PropTypes.func.isRequired,
      setSuite: PropTypes.func.isRequired
    }),
    selector: PropTypes.object,
    projectDirectory: PropTypes.any,
    app: PropTypes.any,
    suiteModified: PropTypes.any,
    suiteSnippets: PropTypes.any,
    suiteTargets: PropTypes.any,
    suiteFilename: PropTypes.any,
    suiteTitle: PropTypes.any,
    project: PropTypes.any,
    snippetsTest: PropTypes.any,
    git: PropTypes.any,
    settings: PropTypes.any
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
            action, selector, app, projectDirectory, suiteTitle, snippetsTest,
            suiteSnippets, suiteFilename, project, snippets, git, settings, suiteTargets
          } = this.props,
          { tabs } = app,


          suiteTabTitle = suiteFilename
            ? ( <Tooltip placement="bottomRight" title={ suiteTitle }>
              <Icon type="container" />{ truncate( suiteFilename, TAB_TEXT_MAX_LEN ) }
            </Tooltip> )
            : "Loading..." ,

          snippetTabTitle = snippetsTest
            ? ( <Tooltip placement="bottomRight" title={ "Snippet: " + snippetsTest.title }>
              <Icon type="snippets" />{ truncate( snippetsTest.title, TAB_TEXT_MAX_LEN ) }
            </Tooltip> )
            : "Loading...",

          panes = {

            suite: () => ( <TabPane tab={ suiteTabTitle } key="suite" closable={ true }>
              <Main
                action={ action }
                selector={ selector } />
            </TabPane> ),

            testReport: () => ( <TabPane tab="Test report"
              key="testReport" closable={ true } className="report-panel-tab">
              <TestReport
                action={ action }
                targets={ suiteTargets }
                projectDirectory={ projectDirectory }
                headless={ app.headless }
                launcherArgs={ app.launcherArgs }
                checkedList={ app.checkedList }
                environment={ app.environment }
                passSuiteOptions={ app.passSuiteOptions }
                passExportOptions={ app.passExportOptions }
                passProjectOptions={ app.passProjectOptions }
                project={ project }
                snippets={ snippets }
                selector={ selector }
              />
            </TabPane> ),

            projectVariables: () => ( <TabPane tab={ "Template variables" } key="projectVariables" closable={ true }>
              <div className="tabpane-frame"><VariablesPane /></div>
            </TabPane> ),

            projectTargets: () => ( <TabPane tab={ "Shared targets" } key="projectTargets" closable={ true }>
              <div className="tabpane-frame">
                <TargetsPane action={ action }  />
              </div>
            </TabPane> ),

            projectGit: () => ( <TabPane tab={ "GIT" } key="projectGit" closable={ true }>
              <div className="tabpane-frame">
                <GitPane action={ action } git={  git } projectDirectory={ projectDirectory } />
              </div>
            </TabPane> ),

            settings: () => ( <TabPane tab={ "Settings" } key="settings" closable={ true }>
              <SettingsPanel
                action={ action }
                settings={ settings }
                project={ project }
              />
            </TabPane> ),

            snippet: () => ( <TabPane tab={ snippetTabTitle } key="snippet" closable={ true }>
              <SnippetsMain
                snippetsTest={ snippetsTest }
                action={ action }
                selector={ selector } />
            </TabPane> )
          };

    window.consoleCount( __filename );

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