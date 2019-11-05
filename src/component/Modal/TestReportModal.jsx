import React from "react";
import PropTypes from "prop-types";
import { Alert, Checkbox, Modal, Button, Tabs } from "antd";
import Tooltip from "component/Global/Tooltip";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";
import { BrowserOptions } from "./TestReportModal/BrowserOptions";
import If from "component/Global/If";
import * as classes from "./classes";
import { SelectEnv } from "component/Global/SelectEnv";
import { MODAL_DEFAULT_PROPS } from "constant";

/*eslint no-empty: 0*/

const CheckboxGroup = Checkbox.Group,
      { TabPane } = Tabs;

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
    loading: false,
    browserOptions: false,
    updateSnapshot: false,
    interactiveMode: false
  }

  constructor( props ) {
    super( props );
    this.refBrowserOptions = React.createRef();
  }

  onChangeCheckbox = ( checked, field ) => {
    this.setState({
      [ field ]: checked
    });
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

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ testReportModal: false });
  }

  getBrowserOptions() {
    return this.refBrowserOptions.current ? this.refBrowserOptions.current.state : {
      headless: true,
      incognito:true,
      ignoreHTTPSErrors: false,
      launcherArgs: "",
      devtools: false
    };
  }

  onClickOk = async ( e ) => {
    e.preventDefault();
    this.setState({ loading: true });
    setTimeout( () => {

      try {
        const current = this.getCurrentFile(),
              browserOptions = this.getBrowserOptions(),
              checkedList = this.state.modified  ? this.state.checkedList : [ current ];

        this.props.action.setApp({
          checkedList,
          testReportModal: false,
          headless: ( this.state.interactiveMode === true ? false : browserOptions.headless ),
          incognito: browserOptions.incognito,
          ignoreHTTPSErrors: browserOptions.ignoreHTTPSErrors,
          launcherArgs: browserOptions.launcherArgs,
          devtools: browserOptions.devtools,
          updateSnapshot: this.state.updateSnapshot,
          interactiveMode: this.state.interactiveMode
        });


        this.props.action.removeAppTab( "testReport" );
        this.props.action.addAppTab( "testReport" );
      } catch ( err ) {
        console.error( "TestReportModal", err );
      }
      this.setState({ loading: false });

    }, 50 );

  }

  // Do not update until visible
  shouldComponentUpdate( nextProps ) {
    if ( this.props.isVisible !== nextProps.isVisible ) {
      return true;
    }
    if ( !nextProps.isVisible ) {
      return false;
    }
    return true;
  }

  getCurrentFile() {
    const { files, currentSuite } = this.props,
          currentFile = files.find( file => currentSuite === file );
    return currentFile || files[ 0 ];
  }

  render() {
    const { isVisible, files } = this.props,
          current = this.getCurrentFile(),
          checkedList = this.state.modified  ? this.state.checkedList : [ current ];

    return (
      <ErrorBoundary>
        <Modal
          title="Run Tests"
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          { ...MODAL_DEFAULT_PROPS }

          className="checkbox-group--vertical"

          footer={[
            ( <Button
              className={ classes.BTN_CANCEL }
              key="back"
              onClick={ this.onClickCancel }>Cancel</Button> ),
            ( <Button
              className={ classes.BTN_OK }
              key="submit"
              type="primary"
              autoFocus={ true }
              ref={ ( el ) => el && el.buttonNode && el.buttonNode.focus() }
              disabled={ !checkedList.length }
              loading={ this.state.loading }
              onClick={this.onClickOk}>
              Run
            </Button> )
          ]}
        >

          <If exp={ files.length }>

            <Tabs
              className="tabgroup-test-reports"
              hideAdd={ true }
              animated={ false }
            >

              <TabPane tab="General" key="1">


                <SelectEnv theme="test-reports" environments={ this.props.project.environments }
                  environment={ this.props.environment } action={ this.props.action } />

                <div className="test-options">

                  <Checkbox onChange={ e  => this.onChangeCheckbox( e.target.checked, "interactiveMode" ) } >
                  interactive mode<Tooltip
                      title={ "This mode allows you to control testing flow" }
                      icon="info-circle"
                    />
                  </Checkbox>

                  <Checkbox onChange={ e  => this.onChangeCheckbox( e.target.checked, "updateSnapshot" ) } >
                  update comparison images<Tooltip
                      title={ "For CSS regression testing use this option to force Puppetry "
                          + "updating snapshots (screenshots representing proper states of the targets)" }
                      icon="info-circle"
                    />
                  </Checkbox>

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
                <div
                  className={ "modal-suites-checkbox-group"
                + ( files.length >= 8 ? "is-checkbox-group-scrollable" : "" ) }>
                  <CheckboxGroup options={ files }
                    value={ checkedList }
                    onChange={ this.onChange } />
                </div>


              </TabPane>

              <TabPane tab="Browser options" key="2">
                <BrowserOptions ref={ this.refBrowserOptions }  />
              </TabPane>

            </Tabs>


          </If>
          <If exp={ !files.length }>
            <Alert message="No suites available in the project" type="error" />
          </If>

        </Modal>
      </ErrorBoundary>
    );
  }
}