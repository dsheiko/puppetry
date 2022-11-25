import React from "react";
import log from "electron-log";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppLayout } from "component/AppLayout";
import actions from "action";
import LoadingTip from "component/Global/LoadingTip";


// Mapping state to the props
const mapStateToProps = ( state ) => ({
        bootstrapLoaded: state.app.bootstrapLoaded
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
    })
  }

  state = {
    bootstrapLoaded: true
  }

  onSyncResponse = () => {
    this.props.action.loadProject();
    this.props.action.this.setState({ loading: false });
  }

  async bootstrap() {
    const { loadProject,
              loadSettings,
              checkRuntimeTestDirReady,
              checkNewVersion
            } = this.props.action,
            settings = loadSettings();

      // setApp({ greeting: GREETINGS[ Math.floor( Math.random() * GREETINGS.length ) ] });
      checkRuntimeTestDirReady();
      checkNewVersion();


      if ( !settings.projectDirectory ) {
        this.setState({ bootstrapLoaded: true });
        return;
      }

      try {
        await loadProject();
      } catch ( e ) {
        log.warn( `Renderer process: App.loadProject: ${ e }` );
        console.warn( e );
      }

      global.perf.time( "src/container/App.jsx is ready" );

      this.setState({ bootstrapLoaded: true });
  }

  componentDidMount() {
    global.perf.time( "src/container/App.jsx did mount" );
    this.bootstrap();
  }

  render() {
    const { action } = this.props,
          { bootstrapLoaded } = this.state;

    window.consoleCount( __filename );

    return ( <React.Fragment>
      { bootstrapLoaded ? <AppLayout action={ action } /> 
        : ( <div className="ant-spin ant-spin-lg ant-spin-spinning">
        <img width="100" height="100" src="./assets/puppetry.svg" alt="Puppetry" />
        <h1>Puppetry</h1>

        <span>
          <img width="32" height="32" src="./assets/loading.svg" alt="Loading..." />
        </span>

        <LoadingTip />

      </div> ) }
    </React.Fragment> );
  }
}

App.displayName = "App";