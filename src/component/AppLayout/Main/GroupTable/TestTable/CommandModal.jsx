import React from "react";
import PropTypes from "prop-types";
import { Spin, Button } from "antd";
import { CommandForm } from "./CommandTable/CommandForm";
import { InstantModal } from "component/Global/InstantModal";
import ErrorBoundary from "component/ErrorBoundary";
import * as selectors from "selector/selectors";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "action";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.commandModal.isVisible,
        commands: state.app.commandModal.commands,
        record: state.app.commandModal.record,
        sharedTargets: state.project.targets,
        suiteTargets: selectors.getTargetObjMemoized( state )
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class CommandModal extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      removeCommand: PropTypes.func.isRequired,
      updateSuite: PropTypes.func.isRequired
    }),
    sharedTargets: PropTypes.object,
    suiteTargets: PropTypes.object,
    record: PropTypes.object,
    commands: PropTypes.any,
    isVisible: PropTypes.bool.isRequired,
    targets: PropTypes.any
  }

  state = {
    loading: false,
    submitted: false
  }

  onOK = () => {
    this.setState({ submitted: true });
  }

  resetSubmitted = () => {
    this.setState({ submitted: false });
  }

  onCancel = ( record ) => {
    const { setApp, removeCommand } = this.props.action;
    this.setState({ submitted: false });
    setApp({
      commandModal: {
        isVisible: false,
        record: null
      }
    });
    // When we are adding a new command, but pressed cancel in the Editing modal
    // an empty record is added to the list, we have to remove it
    if ( record && !record.target ) {
      removeCommand( record );
    }
  }

  render() {
    const { loading, submitted } = this.state,
          { action, record, isVisible, commands, sharedTargets, suiteTargets } = this.props,

          targets = Object.values({ ...sharedTargets, ...suiteTargets }),

          deferCommandForm = () => <CommandForm
            submitted={ submitted }
            resetSubmitted={ this.resetSubmitted }
            action={ action }
            commands={ commands }
            closeModal={ this.onCancel }
            record={ record }
            targets={ targets } />;

    return ( <ErrorBoundary>
      <InstantModal
        className="modal--instant-command"
        visible={ isVisible }
        title="Edit Command/Assertion"
        id="cCommandModal"
        onOk={this.onOK}
        onCancel={() => this.onCancel( record )}
        footer={[
          <Button key="back"
            className="btn--modal-command-cancel"
            onClick={() => this.onCancel( record )}>Cancel</Button>,
          <Button key="submit" type="primary"
            className="btn--modal-command-ok"
            loading={ loading }
            onClick={this.onOK}>
              Save
          </Button>
        ]}
      >
        { record !== null
          ? deferCommandForm()
          : ( <div className="row--centered"><Spin size="large" tip="Loading..." /></div> )
        }
      </InstantModal>
    </ErrorBoundary> );
  }
}
