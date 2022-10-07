import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import * as classes from "./classes";
import { getAppInstallPath } from "service/io";
import { ruleValidateGenericString } from "service/utils";
import { MODAL_DEFAULT_PROPS } from "constant";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const FormItem = Form.Item,
      connectForm = Form.create();

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.editProjectModal,
        projectName: state.project.name,
        projectDirectory: state.settings.projectDirectory
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
@connectForm
export class EditProjectModal extends AbstractForm {


  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      saveProject: PropTypes.func.isRequired
    }),
    isVisible: PropTypes.bool.isRequired,
    projectDirectory: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired
  }

  close() {
    this.props.action.setApp({ editProjectModal: false });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  onClickOk = async ( e ) => {
    const { validateFields } = this.props.form,
          { projectDirectory } = this.props,
          { updateProject } = this.props.action;

    e.preventDefault();

    validateFields( async ( err, values ) => {
      const { name } = values;
      if ( err ) {
        return;
      }
      await updateProject({ projectDirectory, name });
      this.close();
    });
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
    const { isVisible, projectName, projectDirectory } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="Edit Project"
          visible={ isVisible }
          closable
          onCancel={this.onClickCancel}
          onOk={this.onClickOk}
          { ...MODAL_DEFAULT_PROPS }
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
              disabled={ this.hasErrors( getFieldsError() )  }
              onClick={this.onClickOk}>
              Save
            </Button> )
          ]}
        >
          { isVisible ? <Form>


            <FormItem  label="Project name">
              { getFieldDecorator( "name", {
                initialValue: projectName,
                rules: [
                  {
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
                <Input placeholder="e.g. My awesome project"
                  onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
              )}
            </FormItem>

            <FormItem  label="Project location">
              { getFieldDecorator( "location", {
                initialValue: projectDirectory

              })(
                <Input disabled={ true } />
              )}
            </FormItem>

            <FormItem  label="App data directory">
              { getFieldDecorator( "addDataDirectory", {
                initialValue: getAppInstallPath()

              })(
                <Input disabled={ true } />
              )}
            </FormItem>

          </Form> : this.renderLoading }
        </Modal>
      </ErrorBoundary>
    );
  }
}
