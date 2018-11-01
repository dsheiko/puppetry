import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from "electron";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppLayout } from "../component/AppLayout";
import actions from "../action/actions";
import debounce from "lodash.debounce";
import { E_FILE_NAVIGATOR_UPDATED, E_WATCH_FILE_NAVIGATOR } from "constant";

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
            loadProjectFiles
          } = this.props.action,
          settings = loadSettings();

    if ( !settings.projectDirectory ) {
      return;
    }

    try {
      await loadProject();
      ipcRenderer.on( E_FILE_NAVIGATOR_UPDATED, debounce( () => {
        loadProjectFiles();
      }, 300 ) );
      ipcRenderer.send( E_WATCH_FILE_NAVIGATOR, settings.projectDirectory );
    } catch ( e ) {
      console.log( e );
    }

  }


  render() {
    const { action, store } = this.props;
    return (
      <AppLayout action={action} store={store} />
    );
  }
}
