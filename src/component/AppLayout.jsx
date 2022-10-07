import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import classNames  from "classnames";
import { Spin } from "antd";
import ErrorBoundary from "component/ErrorBoundary";

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
import { EditProjectModal } from "./Modal/EditProjectModal";
import { EditEnvironmentsModal } from "./Modal/EditEnvironmentsModal";
import { NewSnippetModal } from "./Modal/SnippetModal/NewSnippetModal";
import { SaveSnippetAsModal } from "./Modal/SnippetModal/SaveSnippetAsModal";
import { EditSnippetModal } from "./Modal/SnippetModal/EditSnippetModal";
import { AppLightbox } from "./Modal/AppLightbox";
import { connect } from "react-redux";
import { TabGroup  } from "./TabGroup";
import If from "component/Global/If";
import { Toolbar } from "./AppLayout/Toolbar";
import { Projectbar } from "./AppLayout/Projectbar";
import debounceRender from "react-debounce-render";

      // Mapping state to the props
const mapStateToProps = ( state ) => ({
        projectDirectory: state.settings.projectDirectory,
        loading: state.app.loading,
        tabs: state.app.tabs
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      });

@connect( mapStateToProps, mapDispatchToProps )
export class AppLayout extends React.PureComponent {

  whyDidYouRender = true;

  state = {
    collapsed: false
  };

  componentDidMount() {
    global.perf.time( "src/component/AppLayout.jsx did mount" );
  }

  onCollapse = ( collapsed ) => {
    this.setState({ collapsed });
  }

  static propTypes = {
    action: PropTypes.object.isRequired,
    tabs: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
  }

  onEditProject = () => {
    this.props.action.setApp({
      editProjectModal: true
    });
  }

  render() {
    const { action, projectDirectory, loading, tabs } = this.props,
          tabsAnyTrue = Object.keys( tabs.available ).some( key => tabs.available[ key ]);

    window.consoleCount( __filename );
    return (
      <ErrorBoundary>
        <Spin spinning={ loading } size="large">

          <div className={ classNames({
            layout: true,
            "is-loading": loading,
            "has-sticky-tabs-panel": tabs.active
              && ( tabs.active === "suite" || tabs.active === "settings" || tabs.active === "snippet" )

          })} id="cLayout">

            <header className="appbar">
              <div className="appbar__menu">
                <MainMenu />
              </div>
              <div className="appbar__drag"></div>
              <Toolbar />

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

                <ProjectExplorer />
                <SnippetExplorer />

              </aside>
              <main>

                <Projectbar />

                <div className="layout-content">

                { projectDirectory // when all panels closed, show Info
                  ? ( tabsAnyTrue ? <TabGroup /> : <Info /> ) 
                  // if no project open, show Welcome 
                  : ( <Welcome action={ action } projectDirectory={ projectDirectory } /> ) }

                </div>

                <AppFooter action={ action } />

              </main>
            </div>


          </div>


        </Spin>

        <NewSnippetModal
          title="New Snippet"
          data={ { title: "" } }
          />
        <SaveSnippetAsModal title="Save Snippet as..." />
        <EditSnippetModal title="Edit Snippet" />
        <NewProjectModal />
        <OpenSuiteModal />
        <SaveSuiteAsModal />
        <SaveProjectAsModal />
        <NewSuiteModal />
        <AlertMessageModal  />
        <TestReportModal />
        <ExportProjectModal />
        <CommandModal />
        <SnippetModal />
        <InstallRuntimeTestModal />
        <EditTargetsAsCsvModal />
        <EditProjectModal />
        <EditEnvironmentsModal />
        <AppLightbox />

      </ErrorBoundary>
    );
  }
}
