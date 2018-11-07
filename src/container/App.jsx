import React from "react";
import log from "electron-log";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppLayout } from "../component/AppLayout";
import actions from "../action/actions";

// Mapping state to the props
const mapStateToProps = ( state ) => ({ store: state }),
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
      loadProjectFiles: PropTypes.func.isRequired
    }),
    store: PropTypes.object
  }

  async componentDidMount() {
    const { loadProject,
            loadSettings,
            checkRuntimeTestDirReady,
            checkNewVersion
          } = this.props.action,
          settings = loadSettings();

    checkRuntimeTestDirReady();
    checkNewVersion();

    if ( !settings.projectDirectory ) {
      return;
    }

    try {
      await loadProject();
    } catch ( e ) {
      log.warn( `Renderer process: App: ${ e }` );
      console.warn( e );
    }

  }


  render() {
    const { action, store } = this.props;
    return (
      <AppLayout action={action} store={store} />
    );
  }
}
