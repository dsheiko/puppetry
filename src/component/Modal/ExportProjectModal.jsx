import React from "react";
import PropTypes from "prop-types";
import { Icon, Alert, Select, Checkbox, Modal, Button, message } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { exportProject, isDirEmpty } from "service/io";
import BrowseDirectory from "component/Global/BrowseDirectory";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS, RUNNER_JEST } from "constant";
import If from "component/Global/If";
import { TestGeneratorError } from "error";
import { confirmExportProject } from "service/smalltalk";
import * as classes from "./classes";
import { getSelectedVariables, getActiveEnvironment } from "selector/selectors";
import { SelectEnv } from "component/Global/SelectEnv";

const CheckboxGroup = Checkbox.Group,
      { Option } = Select;

export class ExportProjectModal extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      saveSettings: PropTypes.func.isRequired,
      setError: PropTypes.func.isRequired
    }),
    targets: PropTypes.any,
    isVisible: PropTypes.bool.isRequired,
    currentSuite: PropTypes.string.isRequired,
    exportDirectory: PropTypes.string.isRequired,
    projectDirectory: PropTypes.string.isRequired,
    files: PropTypes.arrayOf( PropTypes.string ).isRequired
  }

  state = {
    locked: false,
    browseDirectoryValidateStatus: "",
    selectedDirectory: "",
    checkedList: [],
    indeterminate: true,
    checkAll: false,
    modified: false
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
    this.props.action.setApp({ exportProjectModal: false });
  }

  onClickOk = async ( e ) => {
    const selectedDirectory = this.findSelectedDirectory(),
          { projectDirectory, files, currentSuite, project, environment } = this.props,
          current = files.find( file => currentSuite === file ),
          checkedList = this.state.modified  ? this.state.checkedList : [ current ];

    e.preventDefault();
    if ( !this.isValid() ) {
      return;
    }

    if ( !isDirEmpty( selectedDirectory ) && !await confirmExportProject() ) {
      return;
    }


    this.setState({ locked: true });
    // give it time to update component state, before processing
    setTimeout( async () => {
      const activeEnv = getActiveEnvironment( project.environments, environment );
      this.props.action.saveSettings({ exportDirectory: selectedDirectory });
      try {
        await exportProject(
          projectDirectory,
          selectedDirectory,
          checkedList,
          { runner: RUNNER_JEST },
          this.props.snippets,
          {
            variables: getSelectedVariables( project.variables, activeEnv ),
            environment
          }
        );
        message.info( `Project exported in ${ selectedDirectory }` );
        this.props.action.setApp({ exportProjectModal: false });
      } catch ( err ) {
        const message = err instanceof TestGeneratorError ? "Test parser error" : "Cannot export project";
        this.props.action.setError({
          visible: true,
          message,
          description: err.message
        });
      } finally {
        this.setState({ locked: false });
      }
    }, 100 );
  }

  findSelectedDirectory() {
    return this.state.selectedDirectory || this.props.exportDirectory;
  }


  getSelectedDirectory = ( selectedDirectory ) => {
    this.setState({ selectedDirectory, locked: false });
  }

  isValid() {
    if ( !this.findSelectedDirectory() ) {
      this.setState({ locked: true,  browseDirectoryValidateStatus: A_FORM_ITEM_ERROR });
      return false;
    }
    this.setState({ locked: false,  browseDirectoryValidateStatus: A_FORM_ITEM_SUCCESS });
    return true;
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
    const { isVisible, files, currentSuite, project, environment, action } = this.props,
          current = files.find( file => currentSuite === file ),
          checkedList = this.state.modified  ? this.state.checkedList : [ current ];

    return (
      <ErrorBoundary>
        <Modal
          title="Export project"
          visible={ isVisible }
          closable
          onCancel={ this.onClickCancel }
          onOk={this.onClickOk}
          className="checkbox-group--vertical"

          footer={[
            ( <Button
              className={ classes.BTN_CANCEL }
              key="back" onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button
              className={ classes.BTN_OK }
              key="submit"
              type="primary"
              autoFocus={ true }
              disabled={ !checkedList.length || !this.findSelectedDirectory() }
              loading={ this.state.locked }
              onClick={this.onClickOk}>
              Export
            </Button> )
          ]}
        >
          <p>
        As you press &quot;Export&quot; Puppetry generates a Jest project in the provided location.
        You just need to navigate into the directory,
        install dependencies (<code>npm install</code>) and run the tests (<code>npm test</code>).
          </p>

          <SelectEnv environments={ project.environments }
            environment={ environment } action={ action } />

          <BrowseDirectory
            defaultDirectory={ this.props.exportDirectory }
            validateStatus={ this.state.browseDirectoryValidateStatus }
            getSelectedDirectory={ this.getSelectedDirectory }
            label="Select a directory to export" />

          <If exp={ files.length }>
            <p>Please select suites to export:</p>
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