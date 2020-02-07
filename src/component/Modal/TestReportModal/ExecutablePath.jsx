import React from "react";
import { Checkbox, Switch, Input, Select, Icon, Button, message } from "antd";
import Tooltip from "component/Global/Tooltip";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";
import BrowseDirectory from "component/Global/BrowseDirectory";
import { SELECT_SEARCH_PROPS } from "service/utils";
import executablePath from "service/executablePath";

/*eslint no-empty: 0*/
const { TextArea } = Input,
      { Option } = Select,
      STORAGE_KEYS = {
        chrome: "ChromeExecutablePath",
        firefox: "FirefoxExecutablePath"
      };


export class ExecutablePath extends AbstractComponent {

  state = {
    executablePath: ""
  }

  setExecutablePath( executablePath ) {
    const key = STORAGE_KEYS[ this.props.browser ];
    this.setState({ executablePath });
    localStorage.setItem( key, executablePath );
  }

  onChangePath = ( e ) => {
    this.setState({ executablePath: e.target.value });
  }

  onDetect = ( e ) => {
    e.preventDefault();
    const executablePath = executablePath( this.props.browser === "chrome" ? "google-chrome" : "firefox" );
    if ( !executablePath ) {
      return message( "Sorry, cannot find any matching executable" );
    }
    this.setState({ executablePath: executablePath( "google-chrome" ) });
  }


  componentDidMount() {
    const key = STORAGE_KEYS[ this.props.browser ];
    this.setState({ executablePath: localStorage.getItem( key ) || "" });
  }

  render() {

    return (
      <ErrorBoundary>

        <div className="browser-options-layout browser-options-panel flex-row">
          <div className="flex-item-00">
            Executable path <Tooltip
                      title={ "Path to a browser executable to run instead of the bundled Chromium" }
                      icon="info-circle"
                    />
          </div>
          <div className="flex-item-11">
            <Input onChange={ this.onChangePath } value={ this.state.executablePath } />
          </div>
          <div className="flex-item-00">
            <Button onClick={ this.onDetect } size="small">Detect</Button>
          </div>
        </div>


      </ErrorBoundary>
    );
  }
}