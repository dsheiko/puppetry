import React from "react";
import PropTypes from "prop-types";
import { Alert, Checkbox, Modal, Button, Switch, Input } from "antd";
import Tooltip from "component/Global/Tooltip";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";
import If from "component/Global/If";
import BrowseDirectory from "component/Global/BrowseDirectory";
import { SelectEnv } from "component/Global/SelectEnv";

/*eslint no-empty: 0*/

const { TextArea } = Input;

/**
 * Adds/removes args in the launcher args string
 * @param {String} launcherArgs
 * @param {String} value
 * @param {Boolean} toggle
 * @returns {String}
 */
export function updateLauncherArgs( launcherArgs, value, toggle ) {
  console.log("!0", launcherArgs);
  const args = launcherArgs.split( " " )
    .filter( arg => arg.trim().length )
    .filter( arg => !arg.startsWith( value ) );
  console.log("!1", args );
  if ( toggle ) {
    args.push( value );
  }
  console.log("!2", args.join( " " ) );
  return args.join( " " );
}



export class BrowserOptions extends AbstractComponent {

  static propTypes = {

  }

  state = {
    headless: true,
    incognito: true,
    launcherArgs: "",
    browseDirectoryValidateStatus: "",
    browseDirectoryValidateMessage: ""
  }

  constructor( props ) {
    super( props );
    this.inputLauncherArgsRef = React.createRef();
  }

  onChangeCheckbox = ( checked, field ) => {
    this.setState({
      [ field ]: checked
    });
  }

  onSwitchChange = ( checked ) => {
    this.setState({
      headless: !checked
    });
  }

  onCheckMaximize = ( e ) => {
    this.setState({
      launcherArgs: updateLauncherArgs( this.state.launcherArgs, `--start-maximized`, e.target.checked )
    });
  }

  onCheckFullscreen = ( e ) => {
    this.setState({
      launcherArgs: updateLauncherArgs( this.state.launcherArgs, `--start-fullscreen`, e.target.checked )
    });
  }

  onCheckIncognito = ( e ) => {
    this.setState({
      incognito: e.target.checked
    });
  }

  onChangeLauncherArgs = ( e ) => {
    this.setState({
      launcherArgs: e.target.value
    });
  }

  getSelectedDirectory = ( selectedDirectory ) => {
    let launcherArgs = this.state.launcherArgs;
    launcherArgs = updateLauncherArgs( launcherArgs, `--disable-extensions-except=${ selectedDirectory }`, true );
    launcherArgs = updateLauncherArgs( launcherArgs, `--load-extension=${ selectedDirectory }`, true );
    this.setState({
      launcherArgs,
      incognito: false,
      headless: false
    });
  }

  render() {
    const checked = !Boolean( this.state.headless );

    return (
      <ErrorBoundary>
          <div>
            <div className="run-in-browser__layout">
              <div>
                <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={ checked }
                onChange={ this.onSwitchChange } />
                { " " } run in browser<Tooltip
                  title={ "By default the tests are running in headless mode (faster). "
                  + "But you can switch for browser mode and see what is really happening on the page" }
                  icon="question-circle"
                />
              </div>
              <div className="chromium-checkbox-group">

                { " " } <Checkbox
                  checked={ this.state.incognito }
                  onChange={ this.onCheckIncognito }
                >
                  incognito window
                </Checkbox>
              </div>

            </div>


            <div>
              <br />

              <div>

                { " " } <Checkbox
                  onChange={ this.onCheckMaximize }
                >
                  maximized
                </Checkbox>

                { " " } <Checkbox
                  onChange={ this.onCheckFullscreen }
                >
                  fullscreen
                </Checkbox>
              </div>

              <div className="ant-form-item-label">
                <label htmlFor="target" title="Additional arguments">
                Additional arguments to Chromium{ " " }
                  <a
                    onClick={ this.onExtClick }
                    href="http://peter.sh/experiments/chromium-command-line-switches/">
                    (list of available options)</a></label>
              </div>

              <TextArea
                onChange={ this.onChangeLauncherArgs }
                ref={ this.inputLauncherArgsRef }
                value={ this.state.launcherArgs }
                autosize={{ minRows: 3, maxRows: 5 }}
                placeholder="--start-maximized --ignore-certificate-errors" />


            <BrowseDirectory
              defaultDirectory={ this.state.projectDirectory }
              validateStatus={ this.state.browseDirectoryValidateStatus }
              validateMessage={ this.state.browseDirectoryValidateMessage }
              getSelectedDirectory={ this.getSelectedDirectory }
              label="Chrome extension location (optional)" />

            </div>
          </div>

      </ErrorBoundary>
    );
  }
}