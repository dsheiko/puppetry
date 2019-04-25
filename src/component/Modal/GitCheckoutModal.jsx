import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Form, Modal, Button, Input, Row, Col, Collapse } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { ipcRenderer } from "electron";
import { E_GIT_LOG, E_GIT_LOG_RESPONSE } from "constant";
import * as classes from "./classes";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create();

export class GitCheckoutModal extends AbstractComponent {

  static propTypes = {
    action:  PropTypes.shape({
      updateApp: PropTypes.func.isRequired
    }),
    git: PropTypes.object.isRequired,
    projectDirectory: PropTypes.string,
    isVisible: PropTypes.bool.isRequired
  }


  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ gitCheckoutModal: false });
  }

  onClickOk = ( e ) => {
    const { createSuite, updateApp } = this.props.action,
          { git, projectDirectory } = this.props;

    e.preventDefault();

  }

  onGitLogResponse( env, rsp ) {
    console.log(env, rsp);
  }

  componentDidmount() {

    ipcRenderer.send(
        E_GIT_LOG,
        this.props.projectDirectory
    );

    ipcRenderer.removeAllListeners( E_GIT_LOG_RESPONSE );
    ipcRenderer.on( E_GIT_LOG_RESPONSE, this.onGitLogResponse );

  }


  render() {
    const { isVisible } = this.props;

    return (
      <ErrorBoundary>
        <Modal
          title="New Commit"
          visible={ isVisible }
          className="c-new-git-commit-modal"
          closable
          onCancel={this.onClickCancel}
          footer={[
            ( <Button
              autoFocus={ true }
              className={ classes.BTN_OK }
              key="submit"
              type="primary"
              onClick={this.onClickOk}>
              Create
            </Button> ) ]}
        >

         .....

        </Modal>
      </ErrorBoundary>
    );
  }
}

