import React from "react";
import { Checkbox, Input, Icon, message } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractPersistentState from "component/AbstractPersistentState";
import { updateLauncherArgs } from "./utils";

/*eslint no-empty: 0*/
const { TextArea } = Input;


export class FirefoxArguments extends AbstractPersistentState {

  state = {
    launcherArgs: "",
    ignoreHTTPSErrors: false
  }

  constructor( props ) {
    super( props );
    this.inputLauncherArgsRef = React.createRef();
  }

  onCheckIgnoreHttps = ( e ) => {
    this.setState({
      ignoreHTTPSErrors: e.target.checked
    });
  }

  onChangeLauncherArgs = ( e ) => {
    this.setState({
      launcherArgs: e.target.value
    });
  }

  render() {

    return (
      <ErrorBoundary>

        <div className="browser-options-layout">

        <div>

            { " " } <Checkbox
              onChange={ this.onCheckIgnoreHttps }
            >
                  ignore HTTPS errors
            </Checkbox>
          </div>

          <div className="ant-form-item-label">
            <label htmlFor="target" title="Additional arguments">
                <a
                onClick={ this.onExtClick }
                href="https://developer.mozilla.org/en-US/docs/Mozilla/Command_Line_Options">Additional arguments</a>
                { " " }to pass to the browser instance</label>
          </div>

          <TextArea
            onChange={ this.onChangeLauncherArgs }
            ref={ this.inputLauncherArgsRef }
            value={ this.state.launcherArgs }
            placeholder="-private" />

        </div>


      </ErrorBoundary>
    );
  }
}