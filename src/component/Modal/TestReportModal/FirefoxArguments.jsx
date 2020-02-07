import React from "react";
import { Checkbox, Input, Icon, message } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";


/*eslint no-empty: 0*/
const { TextArea } = Input;


export class FirefoxArguments extends AbstractComponent {

  state = {
    launcherArgs: ""
  }

  constructor( props ) {
    super( props );
    this.inputLauncherArgsRef = React.createRef();
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

          <div className="ant-form-item-label">
            <label htmlFor="target" title="Additional arguments">
                Additional arguments to pass to the browser instance{ " " }
              <a
                onClick={ this.onExtClick }
                href="https://developer.mozilla.org/en-US/docs/Mozilla/Command_Line_Options">
                    (list of available options)</a></label>
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