import React from "react";
import PropTypes from "prop-types";
import { Tabs, Icon, Tooltip } from "antd";
import { Main } from "./Main";
import { SnippetsMain } from "./SnippetsMain";
import { SettingsPanel } from "./Settings/SettingsPanel";
import { VariablesPane } from "./Project/Variables/VariablesPane";
import { TargetsPane } from "./Project/Targets/TargetsPane";
import { TestReport } from "./Editor/TestReport";
import ErrorBoundary from "component/ErrorBoundary";
import { confirmUnsavedChanges } from "service/smalltalk";
import { truncate } from "service/utils";
import { connect } from "react-redux";
import actions from "action";
import * as selectors from "selector/selectors";
import { bindActionCreators } from "redux";

const TabPane = Tabs.TabPane,
      TAB_TEXT_MAX_LEN = 16,

       snippetTabTitle = ( <Tooltip placement="bottomRight" title="Snippets">
              <Icon type="snippets" />Snippets
            </Tooltip> ),

      // Mapping state to the props
      mapStateToProps = ( state, props ) => ({
        projectDirectory: state.settings.projectDirectory,
        tabPanels: selectors.getAppTabPanelsMemoized( state ),
        suiteModified: state.suite.modified,

        snippets: state.snippets,

        suiteTargets: state.suite.targets,
        suiteFilename: state.suite.filename,
        suiteTitle: state.suite.description || state.suite.title,
        project: state.project,
        settings: state.settings,

        snippetsTest: selectors.getSnippetsTestMemoized( state, props )
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });
/*eslint react/prop-types: 0*/
@connect( mapStateToProps, mapDispatchToProps )
export class Editor extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      removeAppTab: PropTypes.func.isRequired,
      setActiveAppTab: PropTypes.func.isRequired,
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
    settings: PropTypes.any,
    activeAppTabId: PropTypes.any
  }

  onEdit = ( targetKey, action ) => {
    this[ action ]( targetKey );
  }

  onChange = ( targetKey ) => {
    this.props.action.setActiveAppTab( targetKey );
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

  getSuiteTitle( panel ) {
    return panel.title
      ? ( <Tooltip placement="bottomRight" title={ panel.title }>
        <Icon type="container" />{ truncate( panel.title, TAB_TEXT_MAX_LEN ) }
      </Tooltip> )
      : "Loading...";
  } 

  render() {

    const {
            action, selector, tabPanels, projectDirectory, snippetsTest,
            project, snippets, settings, suiteTargets,
            activeAppTabId
          } = this.props,


          panes = {

            suite: ( panel ) => ( <TabPane tab={ this.getSuiteTitle( panel ) } key={ panel.id } closable={ true }>
              <Main />
            </TabPane> ),

            testReport: () => ( <TabPane tab="Test report"
              key="testReport" closable={ true } className="report-panel-tab">
              <TestReport
                action={ action }
                targets={ suiteTargets }
                projectDirectory={ projectDirectory }                
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

            settings: () => ( <TabPane tab={ "Settings" } key="settings" closable={ true }>
              <SettingsPanel
                action={ action }
                settings={ settings }
                project={ project }
              />
            </TabPane> ),

            snippet: ( panel ) => ( <TabPane tab={ snippetTabTitle } key={ panel.id } closable={ true }>
              <SnippetsMain />
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
          activeKey={ activeAppTabId || "" }
          onChange={ this.onChange }
          onEdit={ this.onEdit }
        >

          { tabPanels
            .map( panel => panes[ panel.type ]( panel ) ) }

        </Tabs>
      </ErrorBoundary>
    );
  }

}