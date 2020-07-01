import React from "react";
import PropTypes from "prop-types";
import AbstractSnippetModal from "./AbstractSnippetModal";
import { Form } from "antd";

/*eslint no-useless-escape: 0*/

const connectForm = Form.create();

@connectForm
export class EditSnippetModal extends AbstractSnippetModal {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      cloneSnippetsCommand: PropTypes.func.isRequired
    }),

    isVisible: PropTypes.bool.isRequired
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ editSnippetModal: false });
  }

  onClickOk = ( e ) => {
    const { validateFields } = this.props.form,
          { id } = this.props.data,
          { setApp, updateSnippetsTest } = this.props.action;

    e.preventDefault();

    validateFields( ( err, values ) => {
      const { title } = values;
      if ( err ) {
        return;
      }
      setApp({ editSnippetModal: false });
      updateSnippetsTest({
        title,
        id
      });
    });
  }


};
