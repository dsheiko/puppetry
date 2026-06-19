import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import classNames  from "classnames";
import { Spin, Layout } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { Toolbar } from "./AppLayout/Toolbar";
import { MainMenu } from "./AppLayout/Sider/MainMenu";
import { ProjectExplorer  } from "./AppLayout/Sider/ProjectExplorer";
import { AppFooter } from "./AppLayout/AppFooter";
import { Welcome } from "./AppLayout/Welcome";
import { Info } from "./AppLayout/Info";
import { NewProjectModal  } from "./Modal/NewProjectModal";
import { OpenProjectModal  } from "./Modal/OpenProjectModal";
import { SaveSuiteAsModal  } from "./Modal/SaveSuiteAsModal";
import { NewSuiteModal  } from "./Modal/NewSuiteModal";
import { AlertMessageModal } from "./Modal/AlertMessageModal";
import { TestReportModal  } from "./Modal/TestReportModal";
import { ExportProjectModal } from "./Modal/ExportProjectModal";
import { OpenSuiteModal } from "./Modal/OpenSuiteModal";
import { SaveProjectAsModal } from "./Modal/SaveProjectAsModal";
import { CommandModal } from "./AppLayout/Main/TestTable/CommandModal";
import { SnippetModal } from "./AppLayout/Main/TestTable/SnippetModal";
import { InstallRuntimeTestModal } from "./Modal/InstallRuntimeTestModal";
import { EditTargetsAsCsvModal } from "./Modal/EditTargetsAsCsvModal";
import { EditProjectModal } from "./Modal/EditProjectModal";
import { EditEnvironmentsModal } from "./Modal/EditEnvironmentsModal";
import { AppLightbox } from "./Modal/AppLightbox";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";
import { TabGroup  } from "./TabGroup";
import If from "component/Global/If";


const { Sider } = Layout,
      mapStateToProps = ( state ) => ({
        loading:                 state.app.loading,
        tabs:                    state.app.tabs,
        commandModal:            state.app.commandModal,
        snippetModal:            state.app.snippetModal,
        newProjectModal:         state.app.newProjectModal,
        openProjectModal:        state.app.openProjectModal,
        openSuiteModal:          state.app.openSuiteModal,
        saveSuiteAsModal:        state.app.saveSuiteAsModal,
        saveProjectAsModal:      state.app.saveProjectAsModal,
        newSuiteModal:           state.app.newSuiteModal,
        alert:                   state.app.alert,
        testReportModal:         state.app.testReportModal,
        exportProjectModal:      state.app.exportProjectModal,
        readyToRunTests:         state.app.readyToRunTests,
        editTargetsAsCsvModal:   state.app.editTargetsAsCsvModal,
        editProjectModal:        state.app.editProjectModal,
        editEnvironmentsModal:   state.app.editEnvironmentsModal,
        appLightbox:             state.app.appLightbox,
        lightbox:                state.app.lightbox,
        installRuntimeTestModal: state.app.installRuntimeTestModal,
        environment:             state.app.environment,
        projectFiles:            state.app.project.files,
        projectDirectory:        state.settings.projectDirectory,
        exportDirectory:         state.settings.exportDirectory,
        projects:                state.settings.projects,
        suiteFilename:           state.suite.filename,
        suiteModified:           state.suite.modified,
        suiteTargets:            state.suite.targets,
        projectName:             state.project.name,
        projectEnvironments:     state.project.environments,
        snippets:                state.snippets,
        project:                 state.project,
        cleanSnippets:           selectors.getCleanSnippetsMemoized( state )
      }),
      mapDispatchToProps = () => ({
      });

@connect( mapStateToProps, mapDispatchToProps )
export class AppLayout extends React.Component {

  state = {
    collapsed: false
  };

  onCollapse = ( collapsed ) => {
    this.setState({ collapsed });
  }

  static propTypes = {
    action:                  PropTypes.object.isRequired,
    selector:                PropTypes.object.isRequired,
    cleanSnippets:           PropTypes.object.isRequired,
    loading:                 PropTypes.bool,
    tabs:                    PropTypes.object,
    commandModal:            PropTypes.object,
    snippetModal:            PropTypes.object,
    alert:                   PropTypes.object,
    lightbox:                PropTypes.object,
    project:                 PropTypes.object,
    snippets:                PropTypes.object,
    projectFiles:            PropTypes.array,
    projectEnvironments:     PropTypes.array,
    projectDirectory:        PropTypes.string,
    exportDirectory:         PropTypes.string,
    suiteFilename:           PropTypes.string,
    projectName:             PropTypes.string,
    environment:             PropTypes.string,
    suiteTargets:            PropTypes.object,
    projects:                PropTypes.object,
    suiteModified:           PropTypes.bool,
    readyToRunTests:         PropTypes.bool,
    appLightbox:             PropTypes.bool,
    newProjectModal:         PropTypes.bool,
    openProjectModal:        PropTypes.bool,
    openSuiteModal:          PropTypes.bool,
    saveSuiteAsModal:        PropTypes.bool,
    saveProjectAsModal:      PropTypes.bool,
    newSuiteModal:           PropTypes.bool,
    testReportModal:         PropTypes.bool,
    exportProjectModal:      PropTypes.bool,
    editTargetsAsCsvModal:   PropTypes.bool,
    editProjectModal:        PropTypes.bool,
    editEnvironmentsModal:   PropTypes.bool,
    installRuntimeTestModal: PropTypes.bool
  }

  render() {
    const { action, selector, cleanSnippets,
            loading, tabs, commandModal, snippetModal,
            projectDirectory, exportDirectory, projects,
            suiteFilename, suiteModified, suiteTargets,
            projectName, projectEnvironments,
            projectFiles, readyToRunTests,
            snippets, project, environment,
            alert, appLightbox, lightbox,
            newProjectModal, openProjectModal, openSuiteModal,
            saveSuiteAsModal, saveProjectAsModal, newSuiteModal,
            testReportModal, exportProjectModal,
            editTargetsAsCsvModal, editProjectModal, editEnvironmentsModal,
            installRuntimeTestModal
          } = this.props,
          tabsAnyTrue = Object.keys( tabs.available ).some( key => tabs.available[ key ]);

    return (
      <ErrorBoundary>
        <Spin spinning={ loading } size="large">
          <Layout className={classNames({
            layout: true,
            "is-loading": loading,
            "has-sticky-tabs-panel": tabs.active
              && ( tabs.active === "suite" || tabs.active === "settings" )

          })} id="cLayout">

            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
              width="250"
            >
              <div className={ this.state.collapsed ? "logo is-collapsed" : "logo is-expanded"}>
                <div className="logo__item logo__collapsed" >
                  <img src="./assets/puppetry.svg" alt="Puppetry" />
                </div>
                <div className="logo__item logo__expanded" >
                  <img src="./assets/puppetry.svg" alt="Puppetry" />
                  <h1>Puppetry
                    <span>ver.{ " " + remote.app.getVersion() }</span>
                  </h1>

                </div>
              </div>

              <MainMenu
                action={ action }
                isProjectEmpty={ !projectFiles.length }
                isSuiteOpen={ !!suiteFilename }
                projectDirectory={ projectDirectory }
                isProjectOpen={ !!projectDirectory }
                suiteModified={ !!suiteModified }
                readyToRunTests={ !!readyToRunTests }
              />

              { projectFiles.length && <ProjectExplorer
                projectDirectory={ projectDirectory }
                projects={ projects }
                suiteModified={ suiteModified }
                files={ projectFiles }
                active={ suiteFilename }
                action={ action } /> }

            </Sider>
            <Layout>
              <Toolbar projectName={ projectName } suiteModified={ suiteModified } action={ action } />

              <div className="layout-content">

                <If exp={ tabsAnyTrue }>
                  <TabGroup action={ action } selector={ selector } />
                </If>
                <If exp={ !tabsAnyTrue }>
                  { projectDirectory ? ( <Info action={ action }
                    projectFiles={ projectFiles }
                    projectName={ projectName }
                    projectDirectory={ projectDirectory }
                  /> )
                    : ( <Welcome action={ action } projectDirectory={ projectDirectory } /> )
                  }
                </If>

              </div>

              <AppFooter action={action} />
            </Layout>

          </Layout>


        </Spin>

        <NewProjectModal
          action={action}
          isVisible={ newProjectModal }
          projectName={ projectName }
          projectDirectory={ projectDirectory } />

        <OpenProjectModal
          action={action}
          isVisible={ openProjectModal }
          projectDirectory={ projectDirectory } />

        <OpenSuiteModal
          action={action}
          projectDirectory={ projectDirectory }
          suiteModified={ suiteModified }
          files={ projectFiles }
          active={ suiteFilename }
          isVisible={ openSuiteModal } />

        <SaveSuiteAsModal
          action={action}
          isVisible={ saveSuiteAsModal }
          files={ projectFiles }
          filename={ suiteFilename } />

        <SaveProjectAsModal
          action={action}
          isVisible={ saveProjectAsModal }
          files={ projectFiles }
          filename={ suiteFilename } />

        <NewSuiteModal
          action={action}
          isVisible={ newSuiteModal } />


        <AlertMessageModal action={action}
          isVisible={ alert.visible }
          alert={ alert } />

        <TestReportModal
          action={action}
          currentSuite={ suiteFilename }
          files={ projectFiles }
          isVisible={ testReportModal }
          snippets={ snippets }
          environment={ environment }
          project={ project } />

        <ExportProjectModal action={action}
          currentSuite={ suiteFilename }
          files={ projectFiles }
          exportDirectory={ exportDirectory }
          projectDirectory={ projectDirectory }
          targets={ suiteTargets }
          snippets={ snippets }
          project={ project }
          environment={ environment }
          readyToRunTests={ readyToRunTests }
          isVisible={ exportProjectModal } />

        <CommandModal
          isVisible={ commandModal.isVisible }
          commands={ commandModal.commands }
          action={ action }
          record={ commandModal.record } />

        { snippetModal.isVisible && <SnippetModal
          isVisible={ true }
          record={ snippetModal.record }
          snippets={ cleanSnippets }
          action={ action } /> }

        <InstallRuntimeTestModal
          action={ action }
          isVisible={ installRuntimeTestModal } />

        <EditTargetsAsCsvModal
          isVisible={ editTargetsAsCsvModal }
          targets={ suiteTargets }
          action={ action }
        />

        <EditProjectModal
          isVisible={ editProjectModal }
          projectName={ projectName }
          projectDirectory={ projectDirectory }
          action={ action } />

        <EditEnvironmentsModal
          isVisible={ editEnvironmentsModal }
          environments={ projectEnvironments }
          action={ action } />

        <AppLightbox
          isVisible={ appLightbox }
          data={ lightbox }
          action={ action } />

      </ErrorBoundary>
    );
  }
}
