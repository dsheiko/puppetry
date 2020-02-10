import React from "react";
import { Checkbox, Switch, Input, Select, Icon } from "antd";
import Tooltip from "component/Global/Tooltip";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";
import BrowseDirectory from "component/Global/BrowseDirectory";
import { SELECT_SEARCH_PROPS } from "service/utils";

import { ExecutablePath } from "./ExecutablePath";
import { ChromeArguments } from "./ChromeArguments";
import { FirefoxArguments } from "./FirefoxArguments";
import { updateLauncherArgs } from "./utils";


/*eslint no-empty: 0*/
const { TextArea } = Input,
      { Option } = Select;




export class BrowserOptions extends AbstractComponent {

  static propTypes = {

  }

  state = {
    browser: "default",
    incognito: true,
    devtools: false,
    browseDirectoryValidateStatus: "",
    browseDirectoryValidateMessage: "",
    launcherArgs: ""
  }

  constructor( props ) {
    super( props );
    this.refChromeArguments = React.createRef();
    this.refFirefoxArguments = React.createRef();
    this.refExecutablePath = React.createRef();
  }

  onChangeCheckbox = ( checked, field ) => {
    this.setState({
      [ field ]: checked
    });
  }



  onBrowserChange = ( browser ) => {
    this.setState({ browser });
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
    const checked = !this.state.headless;

    return (
      <ErrorBoundary>

        <div className="run-in-browser__layout">

          <div className="select-group-inline">
              <span className="select-group-inline__label">
                  <Icon type="desktop" title="Select a browser to run the tests in" />
              </span>
              <Select
                  { ...SELECT_SEARCH_PROPS }
                  style={{ width: 172 }}
                  defaultValue="default"
                  onChange={ this.onBrowserChange }
                >
                <Option value="default" key="default">Headless Chromium</Option>
                <Option value="chromium" key="chromium">Chromium</Option>
                <Option value="chrome" key="chrome">Chrome</Option>
                <Option value="firefox" key="firefox">Firefox <Icon type="experiment" /></Option>
              </Select>
          </div>



          <div className="chromium-checkbox-group">
            { " " } <Checkbox
              checked={ this.state.devtool }
              onChange={ e => this.onChangeCheckbox( e.target.checked, "devtool" ) }
            >
                  DevTools
            </Checkbox>

            { " " } <Checkbox
              checked={ this.state.incognito }
              onChange={ e => this.onChangeCheckbox( e.target.checked, "incognito" ) }
            >
                  incognito window
            </Checkbox>
          </div>

        </div>

        { ( this.state.browser === "chrome" || this.state.browser === "firefox" )
         ? <ExecutablePath browser={ this.state.browser } ref={ this.refExecutablePath } /> : null }

        { this.state.browser !== "firefox"
        ? <ChromeArguments ref={ this.refChromeArguments } />
        : <FirefoxArguments ref={ this.refFirefoxArguments } /> }

        { this.state.browser !== "firefox" && <div className="browser-options-layout">
          <BrowseDirectory
            defaultDirectory={ this.state.projectDirectory }
            validateStatus={ this.state.browseDirectoryValidateStatus }
            validateMessage={ this.state.browseDirectoryValidateMessage }
            getSelectedDirectory={ this.getSelectedDirectory }
            label="Chrome extension location (optional)" />
        </div> }


      </ErrorBoundary>
    );
  }
}