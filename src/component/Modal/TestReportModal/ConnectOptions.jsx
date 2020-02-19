import React from "react";
import { Input } from "antd";
import Tooltip from "component/Global/Tooltip";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractPersistentState from "component/AbstractPersistentState";

/*eslint no-empty: 0*/

export class ConnectOptions extends AbstractPersistentState {

  state = {
    browserWSEndpoint: ""
  }

  onChangePath = ( e ) => {
    this.setState({ browserWSEndpoint: e.target.value });
  }

  render() {

    return (
      <ErrorBoundary>

        <div className="browser-options-layout browser-options-panel flex-row">
          <div className="flex-item-00">
            WS Endpoint <Tooltip
              title={ "Browser websocket endpoint to connect to." }
              icon="info-circle"
            />
          </div>
          <div className="flex-item-11">
            <Input onChange={ this.onChangePath } value={ this.state.browserWSEndpoint } />
          </div>
        </div>


      </ErrorBoundary>
    );
  }
}