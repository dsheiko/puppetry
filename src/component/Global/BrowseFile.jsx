import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from "electron";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Input, Button } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { A_FORM_ITEM_ERROR, E_BROWSE_FILE, E_FILE_SELECTED } from "constant";

const FormItem = Form.Item;

export default class BrowseFile extends React.Component {

  static propTypes = {
    label: PropTypes.string,
    validateStatus: PropTypes.string,
    validateMessage: PropTypes.string,
    defaultPath: PropTypes.string,
    getSelectedFile: PropTypes.func
  }


  state = {
    selectedDirectory: ""
  }

  onBrowse = ( e ) => {
    e.preventDefault();
    ipcRenderer.send( E_BROWSE_FILE, this.props.defaultPath );
  }

  componentDidMount() {
    ipcRenderer.on( E_FILE_SELECTED, ( ...args ) => {
      const selectedDirectory = args[ 1 ];
      this.props.getSelectedFile( selectedDirectory );
      this.setState({ selectedDirectory });
    });
  }

  render() {
    const { label, validateStatus, validateMessage } = this.props;

    return (
      <ErrorBoundary>
        <div className="fieldset-browse">
          <FormItem label={ label }
            validateStatus={ validateStatus }
            help={ validateStatus === A_FORM_ITEM_ERROR ?  ( validateMessage || "Please select a directory" ) : "" }
          >
            <Input
              disabled={ true }
              value={ this.state.selectedDirectory  }  />
          </FormItem>
          <FormItem>
            <Button onClick={ this.onBrowse }>Browse...</Button>
          </FormItem>
        </div>
      </ErrorBoundary>
    );
  }
}