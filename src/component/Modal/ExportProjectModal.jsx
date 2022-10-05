import React from "react";
import PropTypes from "prop-types";
import { Alert, Checkbox, Modal, Button, Select, Icon, message, notification, Spin, Tabs } from "antd";
import AbstractTestRunnerModal from "./AbstractTestRunnerModal";
import ErrorBoundary from "component/ErrorBoundary";
import { exportProject, isDirEmpty  } from "service/io";
import tmp from "tmp-promise";
import BrowseDirectory from "component/Global/BrowseDirectory";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS, RUNNER_JEST, MODAL_DEFAULT_PROPS } from "constant";
import If from "component/Global/If";
import { TestGeneratorError } from "error";
import { confirmExportProject } from "service/smalltalk";
import * as classes from "./classes";
import { getSelectedVariables, getActiveEnvironment } from "selector/selectors";
import { SelectEnv } from "component/Global/SelectEnv";
import exportPrintableText from "./ExportProjectModal/PrintableText";
import { TestSpecificationPane } from "./ExportProjectModal/TestSpecificationPane";
import { JestPane } from "./ExportProjectModal/JestPane";
import { BrowserOptions } from "./TestReportModal/BrowserOptions";
import { SELECT_SEARCH_PROPS } from "service/utils";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const CheckboxGroup = Checkbox.Group,
      { TabPane } = Tabs,
      { Option } = Select,

      DEFAULT_STATE = {
        locked: false,
        browseDirectoryValidateStatus: "",
        selectedDirectory: "",
        checkedList: [],
        indeterminate: true,
        checkAll: false,
        modified: false,
        format: "jest",
        loading: false,
        allure: false,
        cleanup: true,
        error: ""
      };

// Mapping state to the props
const mapStateToProps = ( state ) => ({       
        currentSuite: state.suite.filename,
        files: state.app.project.files,
        exportDirectory: state.settings.exportDirectory,
        projectDirectory: state.settings.projectDirectory,
        targets: state.suite.targets,
        snippets: state.snippets,
        project: state.project,
        environment: state.app.environment,
        readyToRunTests: state.app.readyToRunTests,
        isVisible: state.app.exportProjectModal
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class ExportProjectModal extends AbstractTestRunnerModal {

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
    files: PropTypes.arrayOf( PropTypes.string ).isRequired,
    snippets: PropTypes.any,
    project: PropTypes.any,
    // needed for export printable text
    readyToRunTests: PropTypes.bool.isRequired,
    environment: PropTypes.any
  }

  state = { ...DEFAULT_STATE };

  constructor( props ) {
    super( props );
    this.refBrowserOptions = React.createRef();
    this.refTestSpecificationPane = React.createRef();
  }


  onChangeAllure = ( e ) => {
    this.setState({
      allure: e.target.checked
    });
  }

  onChangeCleanUp = ( e ) => {
    this.setState({
      cleanup: e.target.checked
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
    this.props.action.setApp({ exportProjectModal: false });
  }

  onClickOk = async ( e ) => {
    const selectedDirectory = this.findSelectedDirectory(),
          { projectDirectory, project, environment } = this.props,
          current = this.getCurrentFile(),
          checkedList = this.state.modified  ? this.state.checkedList : [ current ];

    e.preventDefault();
    if ( !this.isValid() ) {
      return;
    }

    if ( !isDirEmpty( selectedDirectory ) && !await confirmExportProject() ) {
      return;
    }


    this.setState({ locked: true, loading: true });
    // give it time to update component state, before processing
    setTimeout( async () => {
      const activeEnv = getActiveEnvironment( project.environments, environment ),
            envDto = {
              variables: getSelectedVariables( project.variables, activeEnv ),
              environment: activeEnv
            },
            browserOptions = this.getBrowserOptions();


      if ( !this.checkExecutablePath( browserOptions ) ) {
        this.setState({ locked: false, loading: false });
        return;
      }

      this.props.action.saveSettings({ exportDirectory: selectedDirectory });
      let filename;
      try {
        switch ( this.state.format ) {
        case "text":

          if ( !this.props.readyToRunTests ) {
            notification.open({
              message: "Dependencies not installed",
              description: "Please, run the tests (F6) "
                    + " to install dependencies."
            });
            this.setState({ loading: false, locked: false });
            return;
          }

          filename = await exportPrintableText({
            projectDirectory,
            selectedDirectory,
            checkedList,
            browserOptions,
            project,
            snippets: this.props.snippets,
            envDto,
            runSpecTests: this.refTestSpecificationPane.current
              ? this.refTestSpecificationPane.current.state.runSpecTests : false
          });

          this.download( filename );
          break;

        default:
          await exportProject({
            projectDirectory,
            outputDirectory: selectedDirectory,
            suiteFiles: checkedList,
            runner: RUNNER_JEST,
            snippets: this.props.snippets,
            sharedTargets: project.targets,
            env: envDto,
            projectOptions: browserOptions,
            suiteOptions: {
              allure: this.state.allure
            },
            exportOptions: {
              cleanup: this.state.cleanup
            }
          });
          message.info( `Project exported in ${ selectedDirectory }` );
          break;
        }


        this.props.action.setApp({ exportProjectModal: false });


      } catch ( err ) {
        console.error( err );
        const message = err instanceof TestGeneratorError ? "Test parser error" : "Cannot export project";
        this.props.action.setApp({ exportProjectModal: false });
        this.props.action.setError({
          visible: true,
          message,
          description: err.message
        });
      } finally {
        this.setState({ loading: false, locked: false });
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
  shouldComponentUpdate( nextProps ) {
    if ( this.props.isVisible !== nextProps.isVisible ) {
      nextProps.isVisible || this.setState( DEFAULT_STATE );
      return true;
    }
    if ( !nextProps.isVisible ) {
      return false;
    }
    return true;
  }

  onChangeFormat = ( format ) => {
    this.setState({ format });
  }

  getCurrentFile() {
    const { files, currentSuite } = this.props,
          currentFile = files.find( file => currentSuite === file );
    return currentFile || files[ 0 ];
  }

  render() {
    const { isVisible, files, project, environment, action } = this.props,
          { format } = this.state,
          current = this.getCurrentFile(),
          checkedList = this.state.modified  ? this.state.checkedList : [ current ];

    return (
      <ErrorBoundary>
        <Modal
          title="Export project"
          visible={ isVisible }
          closable
          onCancel={ this.onClickCancel }
          onOk={this.onClickOk}
          className="export-project-modal checkbox-group--vertical"
          { ...MODAL_DEFAULT_PROPS }
          footer={[
            ( <Button
              className={ classes.BTN_CANCEL }
              key="back" onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button
              className={ classes.BTN_OK }
              ref={ ( el ) => el && el.buttonNode && el.buttonNode.focus() }
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

          <Spin tip="Exporting project..." spinning={ this.state.loading }>

            { this.state.error ? <Alert message={ this.state.error } type="error" /> : null }

            <Tabs
              className="tabgroup-test-reports"
              hideAdd={ true }
              animated={ false }
            >

              <TabPane tab="General" key="1">

                <div className="select-group-inline">
                  <span className="select-group-inline__label">
                    <Icon type="file-unknown" title="Select an output format" />
                  </span>
                  <Select
                    { ...SELECT_SEARCH_PROPS }
                    style={{ width: 348 }}
                    placeholder="Select an output format"
                    onChange={ this.onChangeFormat }
                    value={ format }
                  >
                    <Option value="jest" key="jest">Jest/Puppeteer project (CI-friendly)</Option>
                    <Option value="text" key="text">test specification</Option>
                  </Select>
                </div>

                { format === "jest" && <JestPane /> }

                { format === "text" && <TestSpecificationPane ref={ this.refTestSpecificationPane } /> }


                <SelectEnv theme="test-reports" environments={ project.environments }
                  environment={ environment } action={ action } />


                <BrowseDirectory
                  defaultDirectory={ ( this.props.exportDirectory || tmp.dirSync().name ) }
                  validateStatus={ this.state.browseDirectoryValidateStatus }
                  getSelectedDirectory={ this.getSelectedDirectory }
                  id="inExportProjectModal"
                  label="Select a directory to export" />

                <div className="export-extra-checkbox-group">
                  { format === "jest" && <Checkbox onChange={ this.onChangeAllure }>generate
                    { " " } <a onClick={ this.onExtClick } href="http://allure.qatools.ru/">Allure Test Report</a>
                  </Checkbox> }
                  <Checkbox defaultChecked={ this.state.cleanup } onChange={ this.onChangeCleanUp }>
                    clean up output folder
                  </Checkbox>
                </div>

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

                  <div className={ files.length >= 8 ? "is-checkbox-group-scrollable-export" : ""}>
                    <CheckboxGroup options={ files }
                      value={ checkedList }
                      onChange={ this.onChange } />
                  </div>

                </If>
                <If exp={ !files.length }>
                  <Alert message="No suites available in the project" type="error" />
                </If>

              </TabPane>
              <TabPane tab="Browser options" key="2">
                <BrowserOptions ref={ this.refBrowserOptions }  />
              </TabPane>
            </Tabs>

          </Spin>

        </Modal>
      </ErrorBoundary>
    );
  }
}
