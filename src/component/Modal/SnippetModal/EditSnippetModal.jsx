import React from "react";
import PropTypes from "prop-types";
import AbstractSnippetModal from "./AbstractSnippetModal";
import { Form } from "antd";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

/*eslint no-useless-escape: 0*/

const connectForm = Form.create();

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.editSnippetModal,
        data: state.app.snippetModal 
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
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
          { setApp, updateSnippetsTest, autosaveSnippets } = this.props.action;

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
      autosaveSnippets();
    });
  }


};
