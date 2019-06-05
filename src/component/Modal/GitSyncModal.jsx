import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input  } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { ipcRenderer } from "electron";
import { E_GIT_COMMIT, E_GIT_SYNC, E_GIT_COMMIT_RESPONSE } from "constant";
import { dateToTs } from "service/utils";
import * as classes from "./classes";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class GitSyncModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired
    }),
    git: PropTypes.object.isRequired,
    projectDirectory: PropTypes.string,
    isVisible: PropTypes.bool.isRequired
  }

  close() {
    this.props.action.setApp({ gitSyncModal: false });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  onClickSync= () => {
    this.sync();
  }

  sync() {
    const { git } = this.props;
    ipcRenderer.send( E_GIT_SYNC, this.props.projectDirectory, {
      credentialsAuthMethod: git.credentialsAuthMethod,
      credentialsUsername: git.credentialsUsername,
      credentialsPassword: git.credentialsPassword,
      credentialsAcccessToken: git.credentialsAcccessToken
    }, git.configUsername, git.configEmail, git.remoteRepository );
    this.close();
  }

  onCommitResponse = () => {
    this.props.action.saveGit({
      commitedAt: dateToTs()
    });
    this.sync();
  }

  onClickCommit= ( e ) => {
    const { setApp } = this.props.action,
          { git, projectDirectory } = this.props,
          { validateFields } = this.props.form;

    e.preventDefault();
    validateFields( ( err, values ) => {
      const { message } = values;
      if ( err ) {
        return;
      }

      ipcRenderer.removeAllListeners( E_GIT_COMMIT_RESPONSE );
      ipcRenderer.once( E_GIT_COMMIT_RESPONSE, this.onCommitResponse );

      ipcRenderer.send(
        E_GIT_COMMIT,
        message,
        projectDirectory,
        git.configUsername,
        git.configEmail
      );
      setApp({ gitSyncModal: false });
    });
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
    const { isVisible } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form,
          hasUncommited = false, //( git.commitedAt || 0 ) < ( savedAt || 0 ),

          actionComponent = hasUncommited ? ( <Button
            autoFocus={ true }
            className={ classes.BTN_OK }
            key="submit"
            type="primary"
            onClick={ this.onClickCommit }>
            Commit and Sync
          </Button> ): ( <Button
            autoFocus={ true }
            className={ classes.BTN_OK }
            key="submit"
            type="primary"
            onClick={ this.onClickSync }>
            Sync
          </Button> );

    return (
      <ErrorBoundary>
        <Modal
          title="Sync with remote"
          visible={ isVisible }
          className="c-git-sync-modal"
          disabled={ this.hasErrors( getFieldsError() )  }
          closable
          onCancel={this.onClickCancel}
          footer={[ actionComponent ]}
        >
          <p>
          During synchronization Puppetry sends your changes (working version) to the remote repository
          (e.g. Gitlab, Bitbucket, Github) and fetches changes from the remote repository to the local one.
          So if any versions were added by your teammates since the last synchronization
          you are going to find them in commit log (<code>File/Git/Checkout</code>) any versions.
          You can use copy/paste to transfer changes between versions.
          </p>
          <p>Please make sure your working branch <code>master</code> is not protected
          (See <a href="https://docs.gitlab.com/ee/user/project/protected_branches.html"
            onClick={ this.onExtClick }>Protected Branches at Gitlab</a>)</p>
          <p><b>IMPORTANT</b> You may lose  your local version history. In case of merging conflicts
          Puppetry simply fetches the version history of the remote repository
          and puts your latest version on top of it.</p>
          { hasUncommited && <Form >
            <FormItem
              extra="Please describe briefly the latest changes in your project.
                This message will help you to identify the commit in the version list."
              label="Commit description">
              { getFieldDecorator( "message", {
                rules: [{
                  required: true,
                  message: "Please enter commit description"
                },
                {
                  transform: ( value ) => value.trim()
                }]
              })(
                <Input onChange={ this.onNameChange } placeholder="e.g. Add page.screenshot in form submittion group"
                  onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
              )}
            </FormItem>

          </Form> }

        </Modal>
      </ErrorBoundary>
    );
  }
}

