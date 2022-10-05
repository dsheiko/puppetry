import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Input, Button } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import BrowseDirectory from "component/Global/BrowseDirectory";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS, MODAL_DEFAULT_PROPS } from "constant";
import { isDirEmpty } from "service/io";
import { confirmCreateProject } from "service/smalltalk";
import { normalizeFilename, mkdir } from "service/io";
import * as classes from "./classes";
import { join } from "path";
import { ruleValidateGenericString } from "service/utils";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const FormItem = Form.Item,
      connectForm = Form.create(),
      normalizeSuiteName = ( val ) => {
        return normalizeFilename( val ).toLowerCase();
      };

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.newProjectModal,
        projectName: state.project.name,
        projectDirectory: state.settings.projectDirectory
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
@connectForm
export class NewProjectModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      saveSettings: PropTypes.func.isRequired,
      saveProject: PropTypes.func.isRequired
    }),

    isVisible: PropTypes.bool.isRequired,
    projectName: PropTypes.string.isRequired,
    projectDirectory: PropTypes.string.isRequired
  }

  state = {
    locked: false,
    browseDirectoryValidateStatus: "",
    selectedDirectory: "",
    displayFilename: ""
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ newProjectModal: false });
  }

  onClickOk = async ( e ) => {
    const { validateFields } = this.props.form,
          { setApp, updateProject, createSuite, loadProject } = this.props.action,
          projectDirectory = this.state.selectedDirectory || this.props.projectDirectory;

    e.preventDefault();


    if ( !this.isBrowseDirectoryValid() ) {
      return;
    }

    validateFields( async ( err, values ) => {
      const { name, suiteTitle } = values,
            projectFilename = normalizeSuiteName( name ),
            filename = normalizeSuiteName( suiteTitle ),
            newProjectDirectory = join( projectDirectory, projectFilename );

      if ( err ) {
        return;
      }

      if ( !isDirEmpty( newProjectDirectory ) && !await confirmCreateProject() ) {
        return;
      }

      try {
        mkdir( newProjectDirectory );
      } catch ( err ) {
        this.setState({ locked: true,
          browseDirectoryValidateStatus: `Cannot create directory ${ newProjectDirectory }` });
        return;
      }

      setApp({ newProjectModal: false });
      await updateProject({ projectDirectory: newProjectDirectory, name }, true );
      await createSuite( filename, suiteTitle );
      await loadProject( newProjectDirectory );
      setApp({ newSuiteModal: false });
    });
  }

  isBrowseDirectoryValid() {
    if ( !this.state.selectedDirectory ) {
      this.setState({ locked: true,  browseDirectoryValidateStatus: A_FORM_ITEM_ERROR });
      return false;
    }
    this.setState({ locked: false,  browseDirectoryValidateStatus: A_FORM_ITEM_SUCCESS });
    return true;
  }


  getSelectedDirectory = ( selectedDirectory ) => {
    this.setState({ selectedDirectory, locked: false });
  }

  onNameChange = ( e ) => {
    this.setState({ displayFilename: normalizeSuiteName( e.target.value ) });
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


  render() {
    const { isVisible, projectName } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="New Project"
          className="c-new-project-modal"
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          { ...MODAL_DEFAULT_PROPS }
          footer={[
            ( <Button
              key="back"
              className={ classes.BTN_CANCEL }
              onClick={this.onClickCancel}>Cancel</Button> ),
            ( <Button
              key="submit"
              type="primary"
              className={ classes.BTN_OK }
              disabled={ this.hasErrors( getFieldsError() ) || this.state.locked }
              autoFocus={ true }
              onClick={this.onClickOk}>
              Create
            </Button> )
          ]}
        >
          <Form>
            <FormItem  label="Project name">
              { getFieldDecorator( "name", {
                initialValue: projectName,
                rules: [{
                  required: true,
                  message: "Please enter project name"
                },
                {
                  validator: ruleValidateGenericString
                },
                {
                  transform: ( value ) => value.trim()
                }
                ]
              })(
                <Input placeholder="Project name" onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
              )}
            </FormItem>


            <BrowseDirectory
              id="inNewProjectModal"
              defaultDirectory={ this.state.projectDirectory }
              validateStatus={ this.state.browseDirectoryValidateStatus }
              getSelectedDirectory={ this.getSelectedDirectory }
              label="Project location" />


            {
              /*  New Suite */ ""
            }

            <FormItem  label="Suite title">
              { getFieldDecorator( "suiteTitle", {
                initialValue: "",
                rules: [{
                  required: true,
                  message: "Please enter suite title"
                },
                {
                  validator: ruleValidateGenericString
                },
                {
                  transform: ( value ) => value.trim()
                }]
              })(
                <Input onChange={ this.onNameChange } placeholder="e.g. Main page"
                  onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
              )}
            </FormItem>


            <If exp={ this.state.displayFilename }>
              <p>Suggested filename { " " } <b className="color--primary">
                <i id="cNewSuiteModalFilenamePreview">{ this.state.displayFilename }.json</i></b>
              </p>
            </If>

          </Form>
        </Modal>
      </ErrorBoundary>
    );
  }
}
