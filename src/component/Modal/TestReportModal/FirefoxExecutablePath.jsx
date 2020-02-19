import React from "react";
import { Input, Button, message } from "antd";
import Tooltip from "component/Global/Tooltip";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractPersistentState from "component/AbstractPersistentState";
import detectExecutablePath from "service/detectExecutablePath";

/*eslint no-empty: 0*/

export class FirefoxExecutablePath extends AbstractPersistentState {

  state = {
    executablePath: ""
  }


  onChangePath = ( e ) => {
    this.setState({ executablePath: e.target.value });
  }

  onDetect = ( e ) => {
    e.preventDefault();
    const executablePath = detectExecutablePath( "firefox" );
    if ( !executablePath ) {
      return message( "Sorry, cannot find any matching executable" );
    }
    this.setState({ executablePath });
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