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
        isVisible: state.app.newSnippetModal
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
@connectForm
export class NewSnippetModal extends AbstractSnippetModal {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      addSnippetsTest: PropTypes.func.isRequired
    }),

    isVisible: PropTypes.bool.isRequired
  }


  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ newSnippetModal: false });
  }

  onClickOk = ( e ) => {
    e.preventDefault();
    this.createSnippet();
  }

  createSnippet = () => {
    const { addSnippetsTest, setApp } = this.props.action,
          { validateFields } = this.props.form;

    validateFields( async ( err, values ) => {
      const { title } = values;
      if ( err ) {
        return;
      }
      await addSnippetsTest({ title });
      setApp({ newSnippetModal: false });
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
}

