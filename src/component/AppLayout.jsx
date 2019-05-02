import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import classNames  from "classnames";
import {  Spin, Layout } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { CheckoutMaster } from "component/Global/CheckoutMaster";
import { Toolbar } from "./AppLayout/Toolbar";
import { MainMenu } from "./AppLayout/Sider/MainMenu";
import { ProjectNavigator  } from "./AppLayout/Sider/ProjectNavigator";
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
import { InstallRuntimeTestModal } from "./Modal/InstallRuntimeTestModal";
import { EditTargetsAsCsvModal } from "./Modal/EditTargetsAsCsvModal";
import { GitCommitModal } from "./Modal/GitCommitModal";
import { GitSyncModal } from "./Modal/GitSyncModal";
import { GitCheckoutModal } from "./Modal/GitCheckoutModal";
import { EditProjectModal } from "./Modal/EditProjectModal";

import { TabGroup  } from "./TabGroup";
import If from "component/Global/If";


const { Sider } = Layout;

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
    selector: PropTypes.object.isRequired
  }

  render() {
    const { action, store, selector } = this.props,
          { projectDirectory, exportDirectory } = store.settings,
          { commandModal, tabs } = store.app,
          tabsAnyTrue = Object.keys( tabs.available ).some( key => tabs.available[ key ]);

    return (
      <ErrorBoundary>
        <Spin spinning={store.app.loading} size="large">
          <Layout className={classNames({
            layout: true,
            "is-loading": store.app.loading,
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
                files={ store.app.project.files }
                projectDirectory={ projectDirectory }
                suiteFilename={ store.suite.filename }
                suiteModified={ store.suite.modified }
                readyToRunTests={ store.app.readyToRunTests }
                gitDetachedHeadState={ store.app.gitDetachedHeadState }
                project={ store.project } />

              <If exp={ store.app.project.files.length }>
                <ProjectNavigator
                  projectName={ store.project.name }
                  suiteModified={ store.suite.modified }
                  files={ store.app.project.files }
                  active={ store.suite.filename }
                  action={action} />
              </If>


            </Sider>
            <Layout>
              <Toolbar project={ store.project } suiteModified={ store.suite.modified } action={ action } />

              <div className="layout-content">

                <If exp={ tabsAnyTrue }>
                  <TabGroup action={ action } store={ store } selector={ selector } />
                </If>
                <If exp={ !tabsAnyTrue }>
                  { projectDirectory ? ( <Info action={ action } store={ store } /> )
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
          isVisible={store.app.testReportModal} />

        <ExportProjectModal action={action}
          currentSuite={ store.suite.filename }
          files={ store.app.project.files }
          exportDirectory={ exportDirectory }
          projectDirectory={ projectDirectory }
          targets={ store.suite.targets }
          isVisible={ store.app.exportProjectModal } />

        <CommandModal
          isVisible={ commandModal.isVisible }
          commands={ commandModal.commands }
          targets={ commandModal.targets }
          action={ action }
          record={ commandModal.record } />

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
          git={ store.project.git }
          projectDirectory={ projectDirectory }
          action={ action }
        />

        <GitSyncModal
          isVisible={ store.app.gitSyncModal }
          git={ store.project.git }
          savedAt={ store.project.savedAt }
          projectDirectory={ projectDirectory }
          action={ action }
        />

        <GitCheckoutModal
          isVisible={ store.app.gitCheckoutModal }
          logs={ store.app.gitLogs }
          git={ store.project.git }
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

      </ErrorBoundary>
    );
  }
}
