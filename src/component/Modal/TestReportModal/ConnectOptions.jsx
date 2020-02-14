import React from "react";
import { Checkbox, Switch, Input, Select, Icon, Button, message } from "antd";
import Tooltip from "component/Global/Tooltip";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractPersistentState from "component/AbstractPersistentState";
import BrowseDirectory from "component/Global/BrowseDirectory";
import { SELECT_SEARCH_PROPS} from "service/utils";
import detectExecutablePath from "service/detectExecutablePath";

/*eslint no-empty: 0*/
const { TextArea } = Input,
      { Option } = Select;

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