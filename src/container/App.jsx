import React from "react";
import log from "electron-log";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppLayout } from "../component/AppLayout";
import actions from "../action";
import * as selectors from "../selector/selectors";
import { ipcRenderer } from "electron";
import LoadingTip from "component/Global/LoadingTip";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        bootstrapLoaded: state.app.bootstrapLoaded,
        selector: {
          getTestDataTable: ( group ) => selectors.getGroupTestsMemoized( group ),
          getSelectedTargets: ( selection ) => selectors.getSelectedTargetsMemoized({ ...state, selection }),
          hasTarget: ( target ) => selectors.hasTarget( target, state.suite.targets ),
          findCommandsByTestId:
            ( testId ) => selectors.findCommandsByTestId( testId, state.suite.groups )
        }
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class App extends React.Component {

  static propTypes = {
    action: PropTypes.shape({
      loadProject: PropTypes.func.isRequired,
      loadSettings: PropTypes.func.isRequired,
      loadProjectFiles: PropTypes.func.isRequired,
      checkRuntimeTestDirReady: PropTypes.func.isRequired,
      checkNewVersion: PropTypes.func.isRequired,
      setApp: PropTypes.func.isRequired,
      loadSnippets: PropTypes.func.isRequired
    }),
    bootstrapLoaded: PropTypes.bool.isRequired,
    selector: PropTypes.object
  }

  onSyncResponse = () => {
    this.props.action.loadProject();
    this.props.action.setApp({ loading: false });
  }

  async componentDidMount() {
    const { loadProject,
            loadSettings,
            checkRuntimeTestDirReady,
            checkNewVersion,
            setApp
          } = this.props.action,
          settings = loadSettings();

    global.perf.time( "src/container/App.jsx did mount" );

    // setApp({ greeting: GREETINGS[ Math.floor( Math.random() * GREETINGS.length ) ] });
    checkRuntimeTestDirReady();
    checkNewVersion();


    if ( !settings.projectDirectory ) {
      setApp({ bootstrapLoaded: true });
      return;
    }

    try {
      await loadProject();
    } catch ( e ) {
      log.warn( `Renderer process: App.loadProject: ${ e }` );
      console.warn( e );
    }

    setApp({ bootstrapLoaded: true });
  }

  render() {
    const { action, selector, bootstrapLoaded } = this.props;

    return ( <React.Fragment>
      { !bootstrapLoaded && ( <div className="ant-spin ant-spin-lg ant-spin-spinning">
        <img width="100" height="100" src="./assets/puppetry.svg" alt="Puppetry" />
        <h1>Puppetry</h1>

        <span>
          <img width="32" height="32" src="./assets/loading.svg" alt="Loading..." />
        </span>

        <LoadingTip />

      </div> ) }
      { bootstrapLoaded && <AppLayout action={ action } selector={ selector } /> }
    </React.Fragment> );
  }
}
