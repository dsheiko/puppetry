import React from "react";
import PropTypes from "prop-types";
import AbstractSnippetModal from "./AbstractSnippetModal";
import { Form } from "antd";

import mediator from "service/mediator";
import { MODAL_DEFAULT_PROPS, RE_SNIPPETS_TEST_ADDED } from "constant";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

/*eslint no-useless-escape: 0*/

const connectForm = Form.create();

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.saveSnippetAsModal,
        data: state.app.snippetModal 
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
@connectForm
export class SaveSnippetAsModal extends AbstractSnippetModal {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      cloneSnippetsCommand: PropTypes.func.isRequired
    }),

    isVisible: PropTypes.bool.isRequired
  }


  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ saveSnippetAsModal: false });
  }

  onClickOk = ( e ) => {
    const { validateFields } = this.props.form,
          { id } = this.props.data,
          { setApp, cloneSnippetsTest } = this.props.action;

    e.preventDefault();

    validateFields( ( err, values ) => {
      const { title } = values;
      if ( err ) {
        return;
      }

      setApp({ saveSnippetAsModal: false });
      cloneSnippetsTest({ id }, { title });
    });
  }

  componentDidMount() {
    mediator.removeAllListeners( RE_SNIPPETS_TEST_ADDED );
    mediator.on( RE_SNIPPETS_TEST_ADDED, ( options ) => {
      this.props.action.autosaveSnippets();
      this.props.action.setProject({ lastOpenSnippetId: options.lastInsertTestId });
      this.props.action.addAppTab( "snippet" );
    });
  }


};
