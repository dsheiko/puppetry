import React from "react";
import PropTypes from "prop-types";
import { Alert, Checkbox, Modal, Button, Switch, Input } from "antd";
import Tooltip from "component/Global/Tooltip";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";
import If from "component/Global/If";
import * as classes from "./classes";

const CheckboxGroup = Checkbox.Group;

/**
 * Adds/removes args in the launcher args string
 * @param {String} launcherArgs
 * @param {String} value
 * @param {Boolean} toggle
 * @returns {String}
 */
export function updateLauncherArgs( launcherArgs, value, toggle ) {
  if ( toggle ) {
    return ( launcherArgs + ` ${ value } ` ).trim();
  }
  const re = new RegExp( `\\s?${ value }\\s?` );
  return launcherArgs.replace( re, " " ).trim();
}


export class TestReportModal extends AbstractComponent {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      removeAppTab: PropTypes.func.isRequired,
      addAppTab: PropTypes.func.isRequired
    }),
    isVisible: PropTypes.bool.isRequired,
    currentSuite: PropTypes.string.isRequired,
    files: PropTypes.arrayOf( PropTypes.string ).isRequired
  }

  state = {
    checkedList: [],
    indeterminate: true,
    checkAll: false,
    modified: false,

    headless: true,
    launcherArgs: ""
  }

  constructor( props ) {
    super( props );
    this.inputLauncherArgsRef = React.createRef();
  }

  onChange = ( checkedList ) => {
    const { files } = this.props;
    this.setState({
      checkedList,
      modified: true,
      indeterminate: !!checkedList.length && ( checkedList.length < files.length ),
      checkAll: checkedList.length === files.length
    });
  }

  onCheckAllChange = ( e ) => {
    const { files } = this.props;
    this.setState({
      checkedList: e.target.checked ? files : [],
      modified: true,
      indeterminate: false,
      checkAll: e.target.checked
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

  onChangeLauncherArgs = ( e ) => {
    this.setState({
      launcherArgs: e.target.value
    });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ testReportModal: false });
  }

  onClickOk = async ( e ) => {
    e.preventDefault();
    const { files, currentSuite } = this.props,
          current = files.find( file => currentSuite === file ),
          checkedList = this.state.modified  ? this.state.checkedList : [ current ];

    this.props.action.setApp({
      checkedList,
      testReportModal: false,
      headless: this.state.headless,
      launcherArgs: this.state.launcherArgs
    });
    this.props.action.removeAppTab( "testReport" );
    this.props.action.addAppTab( "testReport" );
  }

  // Do not update until visible
  shouldComponentUpdate( nextProps, nextState ) {
    if ( this.props.isVisible !== nextProps.isVisible ) {
      return true;
    }
    if ( !nextProps.isVisible ) {
      return false;
    }
    return true;
  }

  render() {
    const { isVisible, files, currentSuite } = this.props,
          current = files.find( file => currentSuite === file ),
          checkedList = this.state.modified  ? this.state.checkedList : [ current ];

    return (
      <ErrorBoundary>
        <Modal
          title="Test Reports"
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          className="checkbox-group--vertical"

          footer={[
            ( <Button
              className={ classes.BTN_CANCEL }
              key="back"
              onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button
              className={ classes.BTN_OK }
              key="submit"
              type="primary"
              autoFocus={ true }
              disabled={ !checkedList.length }
              onClick={this.onClickOk}>
              Run
            </Button> )
          ]}
        >

          <If exp={ files.length }>
            <div className="bottom-line run-in-browser">
              <div className="run-in-browser__layout">
                <div>
                  <Switch checkedChildren="On" unCheckedChildren="Off" onChange={ this.onSwitchChange } />
                  { " " } run in browser <Tooltip
                    title={ "By default the tests are running in headless mode (faster). "
                    + "But you can switch for browser mode and see what is really hapenning on the page" }
                    icon="question-circle"
                  />
                </div>
                { !this.state.headless && <div>
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
                </div> }

              </div>
              { !this.state.headless && <div>
                <div className="ant-form-item-label">
                  <label htmlFor="target" title="Additional arguments">
                  Additional arguments to pass to the browser{ " " }
                    <a
                      onClick={ this.onExtClick }
                      href="http://peter.sh/experiments/chromium-command-line-switches/">
                      (list of available options)</a></label>
                </div>
                <Input
                  onChange={ this.onChangeLauncherArgs }
                  ref={ this.inputLauncherArgsRef }
                  value={ this.state.launcherArgs }
                  placeholder="--start-maximized --ignore-certificate-errors" />
              </div> }
            </div>

            <p>Please select suites to run:</p>
            <div className="bottom-line">
              <Checkbox
                indeterminate={ this.state.indeterminate }
                onChange={ this.onCheckAllChange }
                checked={ this.state.checkAll }
              >
                  Check all
              </Checkbox>
            </div>

            <CheckboxGroup options={ files }
              value={ checkedList }
              onChange={ this.onChange } />

          </If>
          <If exp={ !files.length }>
            <Alert message="No suites available in the project" type="error" />
          </If>

        </Modal>
      </ErrorBoundary>
    );
  }
}