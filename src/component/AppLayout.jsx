import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import {  Spin, Layout } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { Toolbar } from "./AppLayout/Toolbar";
import { MainMenu } from "./AppLayout/Sider/MainMenu";
import { ProjectNavigator  } from "./AppLayout/Sider/ProjectNavigator";
import { AppFooter } from "./AppLayout/AppFooter";
import { Welcome } from "./AppLayout/Welcome";
import { NewProjectModal  } from "./Modal/NewProjectModal";
import { OpenProjectModal  } from "./Modal/OpenProjectModal";
import { CloseAppModal  } from "./Modal/CloseAppModal";
import { SaveSuiteAsModal  } from "./Modal/SaveSuiteAsModal";
import { NewSuiteModal  } from "./Modal/NewSuiteModal";
import { AlertMessageModal } from "./Modal/AlertMessageModal";
import { ConfirmDeleteModal } from "./Modal/ConfirmDeleteModal";
import { TestReportModal  } from "./Modal/TestReportModal";
import { ExportProjectModal } from "./Modal/ExportProjectModal";
import { OpenSuiteModal } from "./Modal/OpenSuiteModal";
import { CommandModal } from "./AppLayout/Main/GroupTable/TestTable/CommandModal";
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
    store: PropTypes.object.isRequired
  }

  render() {
    const { action, store } = this.props,
          { projectDirectory, exportDirectory } = store.settings,
          { commandModal, tabs } = store.app,
          tabsAnyTrue = Object.keys( tabs.available ).some( key => tabs.available[ key ]);

    return (
      <ErrorBoundary>
        <Spin spinning={store.app.loading} size="large">
          <Layout className="layout">

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
                  <h1>Pupperty
                    <span>ver.{ " " + remote.app.getVersion() }</span>
                  </h1>

                </div>
              </div>

              <MainMenu
                action={action}
                projectDirectory={ projectDirectory }
                suiteFilename={store.suite.filename}
                project={store.project} />

              <If exp={ store.app.project.files.length }>
                <ProjectNavigator
                  projectName={ store.project.name }
                  files={ store.app.project.files }
                  active={ store.suite.filename }
                  action={action} />
              </If>


            </Sider>
            <Layout>
              <Toolbar project={ store.project } action={ action } />

              <div className="layout-content">

                <If exp={ tabsAnyTrue }>
                  <TabGroup action={ action } store={ store } />
                </If>
                <If exp={ !tabsAnyTrue }>
                  <Welcome action={ action } projectDirectory={ projectDirectory } />
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
          isVisible={store.app.openSuiteModal} />

        <SaveSuiteAsModal
          action={action}
          isVisible={store.app.saveSuiteAsModal}
          files={ store.app.project.files }
          filename={ store.suite.filename } />

        <CloseAppModal
          action={action}
          suiteFilename={ store.suite.filename }
          isVisible={store.app.closeAppModal} />

        <NewSuiteModal
          action={action}
          isVisible={store.app.newSuiteModal} />


        <AlertMessageModal action={action}
          isVisible={ store.app.alert.visible }
          alert={ store.app.alert } />
        <ConfirmDeleteModal action={action}
          isVisible={ store.app.confirmDeleteModal }
          selectedFile={ store.app.selectedFile } />

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

      </ErrorBoundary>
    );
  }
}
