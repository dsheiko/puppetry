import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import classNames  from "classnames";
import { Spin, Layout, Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { CheckoutMaster } from "component/Global/CheckoutMaster";

import { MainMenu } from "./AppLayout/Sider/MainMenu";
import { ProjectExplorer  } from "./AppLayout/Sider/ProjectExplorer";
import { SnippetExplorer  } from "./AppLayout/Sider/SnippetExplorer";
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
import { CommandModal } from "./AppLayout/Main/GroupTable/TestTable/CommandModal";
import { SnippetModal } from "./AppLayout/Main/GroupTable/TestTable/SnippetModal";
import { InstallRuntimeTestModal } from "./Modal/InstallRuntimeTestModal";
import { EditTargetsAsCsvModal } from "./Modal/EditTargetsAsCsvModal";
import { GitCommitModal } from "./Modal/GitCommitModal";
import { GitSyncModal } from "./Modal/GitSyncModal";
import { GitCheckoutModal } from "./Modal/GitCheckoutModal";
import { GitCloneModal } from "./Modal/GitCloneModal";
import { EditProjectModal } from "./Modal/EditProjectModal";
import { EditEnvironmentsModal } from "./Modal/EditEnvironmentsModal";
import { NewSnippetModal } from "./Modal/NewSnippetModal";
import { AppLightbox } from "./Modal/AppLightbox";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";
import { TabGroup  } from "./TabGroup";
import If from "component/Global/If";
import { Toolbar } from "./AppLayout/Toolbar";
import { Projectbar } from "./AppLayout/Projectbar";
import { truncate } from "service/utils";


const { Sider } = Layout,
      // Mapping state to the props
      mapStateToProps = ( state ) => ({
        store: state,
        cleanSnippets: selectors.getCleanSnippetsMemoized( state )
      }),
      // Mapping actions to the props
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
    action: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    selector: PropTypes.object.isRequired,
    cleanSnippets: PropTypes.object.isRequired
  }

  onEditProject = () => {
    this.props.action.setApp({
      editProjectModal: true
    });
  }

  render() {
    const { action, store, selector, cleanSnippets } = this.props,
          { projectDirectory, exportDirectory } = store.settings,
          { commandModal, snippetModal, tabs } = store.app,
          tabsAnyTrue = Object.keys( tabs.available ).some( key => tabs.available[ key ]);
    window.consoleCount( __filename );
    return (
      <ErrorBoundary>
        <Spin spinning={ store.app.loading } size="large">

          <div className={classNames({
            layout: true,
            "is-loading": store.app.loading,
            "has-sticky-tabs-panel": tabs.active
              && ( tabs.active === "suite" || tabs.active === "settings" || tabs.active === "snippet" )

          })} id="cLayout">

            <header className="appbar">
              <div className="appbar__menu">
                <MainMenu
                  action={ action }
                  isProjectEmpty={ !store.app.project.files.length }
                  isSuiteOpen={ !!store.suite.filename }
                  projectDirectory={ projectDirectory }
                  isProjectOpen={ !!projectDirectory }
                  suiteModified={ !!store.suite.modified }
                  readyToRunTests={ !!store.app.readyToRunTests }
                  gitDetachedHeadState={ !!store.app.gitDetachedHeadState }
                  gitConfigUsername={ store.git.configUsername }
                  gitConfigEmail={ store.git.configEmail }
                  isGitInitialized={ !!store.git.initialized }
                  hasGitRemote={ !!store.git.hasRemote }
                />

              </div>
              <div className="appbar__drag"></div>
              <Toolbar projectName={ store.project.name } suiteModified={ store.suite.modified } action={ action } />

            </header>

            <div className="layout__main">
              <aside>

                <div className={ "logo is-expanded" }>
                  <div className="logo__item logo__expanded" >
                    <img src="./assets/puppetry.svg" alt="Puppetry" />
                    <h1>Puppetry
                      <span>ver.{ " " + remote.app.getVersion() }</span>
                    </h1>
                  </div>
                </div>

                <ProjectExplorer
                  projectDirectory={ store.settings.projectDirectory }
                  projects={ store.settings.projects }
                  suiteModified={ store.suite.modified }
                  files={ store.app.project.files }
                  active={ store.suite.filename }
                  action={ action } />

                <SnippetExplorer projectDirectory={ store.settings.projectDirectory }
                  projects={ store.settings.projects }
                  suiteModified={ store.suite.modified }
                  files={ store.app.project.files }
                  action={ action }
                />

              </aside>
              <main>

                { store.project.name ? <Projectbar action={ action } projectName={ store.project.name } /> : null }

                <div className="layout-content">

                  <If exp={ tabsAnyTrue }>
                    <TabGroup action={ action }
                      selector={ selector } />
                  </If>
                  <If exp={ !tabsAnyTrue }>
                    { projectDirectory ? ( <Info action={ action }
                      projectFiles={ store.app.project.files }
                      projectName={ store.project.name }
                      projectDirectory={ store.settings.projectDirectory }
                    /> )
                      : ( <Welcome action={ action } projectDirectory={ projectDirectory } /> )
                    }
                  </If>

                </div>

                <AppFooter action={action} />

              </main>
            </div>


          </div>


        </Spin>

        <NewSnippetModal
          action={action}
          isVisible={store.app.newSnippetModal} />

        <NewProjectModal
          action={action}
          isVisible={store.app.newProjectModal}
          projectName={ store.project.name }
          projectDirectory={ projectDirectory } />

        <OpenProjectModal
          action={action}
          isVisible={store.app.openProjectModal}
          projectDirectory={ projectDirectory } />

        <OpenSuiteModal
          action={action}
          projectDirectory={ projectDirectory }
          suiteModified={ store.suite.modified }
          files={ store.app.project.files }
          active={ store.suite.filename }
          isVisible={store.app.openSuiteModal} />

        <SaveSuiteAsModal
          action={action}
          isVisible={store.app.saveSuiteAsModal}
          files={ store.app.project.files }
          filename={ store.suite.filename } />

        <SaveProjectAsModal
          action={action}
          isVisible={store.app.saveProjectAsModal}
          files={ store.app.project.files }
          filename={ store.suite.filename } />

        <NewSuiteModal
          action={action}
          isVisible={store.app.newSuiteModal} />


        <AlertMessageModal action={action}
          isVisible={ store.app.alert.visible }
          alert={ store.app.alert } />

        <TestReportModal
          action={action}
          currentSuite={ store.suite.filename }
          files={ store.app.project.files }
          isVisible={store.app.testReportModal}
          snippets={ store.snippets }
          environment={ store.app.environment }
          project={ store.project } />

        <ExportProjectModal action={action}
          currentSuite={ store.suite.filename }
          files={ store.app.project.files }
          exportDirectory={ exportDirectory }
          projectDirectory={ projectDirectory }
          targets={ store.suite.targets }
          snippets={ store.snippets }
          project={ store.project }
          environment={ store.app.environment }
          readyToRunTests={ store.app.readyToRunTests }
          isVisible={ store.app.exportProjectModal } />

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
          isVisible={ store.app.installRuntimeTestModal } />

        <EditTargetsAsCsvModal
          isVisible={ store.app.editTargetsAsCsvModal }
          targets={ store.suite.targets }
          action={ action }
        />

        <GitCommitModal
          isVisible={ store.app.gitCommitModal }
          git={ store.git }
          projectDirectory={ projectDirectory }
          action={ action }
        />

        <GitSyncModal
          isVisible={ store.app.gitSyncModal }
          git={ store.git }
          savedAt={ store.project.savedAt }
          projectDirectory={ projectDirectory }
          action={ action }
        />

        <GitCheckoutModal
          isVisible={ store.app.gitCheckoutModal }
          logs={ store.app.gitLogs }
          git={ store.git }
          projectDirectory={ projectDirectory }
          action={ action }
        />

        <GitCloneModal
          isVisible={ store.app.gitCloneModal }
          git={ store.git }
          projectDirectory={ projectDirectory }
          action={ action }
        />

        <CheckoutMaster
          projectDirectory={ projectDirectory }
          action={ action }
        />

        <EditProjectModal
          isVisible={ store.app.editProjectModal }
          projectName={ store.project.name }
          projectDirectory={ projectDirectory }
          action={ action } />

        <EditEnvironmentsModal
          isVisible={ store.app.editEnvironmentsModal }
          environments={ store.project.environments }
          action={ action } />

        <AppLightbox
          isVisible={ store.app.appLightbox }
          data={ store.app.lightbox }
          action={ action } />

      </ErrorBoundary>
    );
  }
}
