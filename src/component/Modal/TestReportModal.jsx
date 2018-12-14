import React from "react";
import PropTypes from "prop-types";
import { Alert, Checkbox, Modal, Button, Switch } from "antd";
import Tooltip from "component/Global/Tooltip";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import * as classes from "./classes";

const CheckboxGroup = Checkbox.Group;

export class TestReportModal extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired,
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
    headless: true
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

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ testReportModal: false });
  }

  onClickOk = async ( e ) => {
    e.preventDefault();
    const { files, currentSuite } = this.props,
          current = files.find( file => currentSuite === file ),
          checkedList = this.state.modified  ? this.state.checkedList : [ current ];

    this.props.action.updateApp({ checkedList, testReportModal: false, headless: this.state.headless });
    this.props.action.removeAppTab( "testReport" );
    this.props.action.addAppTab( "testReport" );
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
            <div className="bottom-line">
              <Switch checkedChildren="On" unCheckedChildren="Off" onChange={ this.onSwitchChange } />
              { " " } run in browser <Tooltip
                title={ "By default the tests are running in headless mode (faster). "
                  + "But you can switch for browser mode and see what is really hapenning on the page" }
                icon="question-circle"
              />
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