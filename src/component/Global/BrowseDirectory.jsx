import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from "electron";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Input, Button } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { A_FORM_ITEM_ERROR, E_BROWSE_DIRECTORY, E_DIRECTORY_SELECTED } from "constant";

const FormItem = Form.Item;

export default class BrowseDirectory extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    defaultDirectory: PropTypes.string,
    validateStatus: PropTypes.string,
    validateMessage: PropTypes.string,
    getSelectedDirectory: PropTypes.func
  }

  constructor( props ) {
    super( props );
    // Lift the state up when defaultDirectory not empty, thus host component won't empty directory error
    props.defaultDirectory && this.props.getSelectedDirectory( props.defaultDirectory );
  }

  state = {
    selectedDirectory: ""
  }

  onBrowse = ( e ) => {
    e.preventDefault();
    ipcRenderer.send( E_BROWSE_DIRECTORY, this.props.id || "unknown" );
  }

  componentDidMount() {
    ipcRenderer.on( E_DIRECTORY_SELECTED, ( ...args ) => {
      const selectedDirectory = args[ 1 ];
      // A foreign caller - all the instances of BrowseDirectory listen to this event
      if ( this.props.id && this.props.id !== args[ 2 ]) {
        return;
      }
      this.props.getSelectedDirectory( selectedDirectory );
      this.setState({ selectedDirectory });
    });
  }

  componentDidUpdate( prevProps ) {
    // Lift the state up when defaultDirectory received after component mounted
    // It's very unlickely but still
    if ( !prevProps.defaultDirectory && this.props.defaultDirectory ) {
      this.props.getSelectedDirectory( this.props.defaultDirectory );
    }
  }

  render() {
    const { label, defaultDirectory, validateStatus, validateMessage } = this.props;

    return (
      <ErrorBoundary>
        <div className="fieldset-browse">
          <FormItem label={ label }
            validateStatus={ validateStatus }
            help={ validateStatus === A_FORM_ITEM_ERROR ?  ( validateMessage || "Please select a directory" ) : "" }
          >
            <Input
              disabled={ true }
              id="cBrowseDirectoryInput"
              value={ this.state.selectedDirectory || defaultDirectory }  />
          </FormItem>
          <FormItem>
            <Button onClick={ this.onBrowse }>Browse...</Button>
          </FormItem>
        </div>
      </ErrorBoundary>
    );
  }
}