import React from "react";
import PropTypes from "prop-types";
import { Spin, Button } from "antd";
import { CommandForm } from "./CommandTable/CommandForm";
import { InstantModal } from "component/Global/InstantModal";
import ErrorBoundary from "component/ErrorBoundary";


export class CommandModal extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      removeCommand: PropTypes.func.isRequired,
      updateSuite: PropTypes.func.isRequired
    }),
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
    const { setApp, removeCommand, updateSuite } = this.props.action;
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
      updateSuite({ modified: true });
    }
  }

  render() {
    const { loading, submitted } = this.state,
          { action, targets, record, isVisible, commands } = this.props,

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
        visible={ isVisible }
        title="Title"
        id="cCommandModal"
        onOk={this.onOK}
        onCancel={this.onCancel}
        footer={[
          <Button key="back" onClick={() => this.onCancel( record )}>Cancel</Button>,
          <Button key="submit" type="primary"
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
