import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Alert, Input } from "antd";
import { ipcRenderer } from "electron";
import { TargetSelect } from "./TargetSelect";
import { ElementMethodSelect } from "./ElementMethodSelect";
import { PageMethodSelect } from "./PageMethodSelect";
import { ParamsFormBuilder } from "./Params/ParamsFormBuilder";
import If from "component/Global/If";
import { getSchema } from "component/Schema/schema";
import { Description } from "component/Schema/Params/Description";
import ErrorBoundary from "component/ErrorBoundary";
import { FIELDSET_DEFAULT_LAYOUT } from "constant";

const FormItem = Form.Item,
      connectForm = Form.create(),
      { TextArea } = Input,
      TEST_LEADING_METHODS = [ "emulate", "setViewport", "closeDialog", "goto", "assertPerfomanceAssetWeight" ];

@connectForm
export class CommandForm extends React.Component {

   static propTypes = {
     action: PropTypes.shape({
       updateSuite: PropTypes.func.isRequired,
       updateCommand: PropTypes.func.isRequired
     }),
     // Coming from connectForm
     form: PropTypes.shape({
       validateFieldsAndScroll: PropTypes.func.isRequired,
       getFieldDecorator: PropTypes.func.isRequired,
       getFieldsError: PropTypes.func.isRequired,
       setFieldsValue: PropTypes.func.isRequired
     }),
     targets: PropTypes.any.isRequired,
     commands: PropTypes.any.isRequired,
     record: PropTypes.object.isRequired,
     closeModal: PropTypes.func.isRequired,
     submitted: PropTypes.bool.isRequired,
     resetSubmitted: PropTypes.func.isRequired
   }

   constructor( props ) {
     super( props );
     this.state = {
       target: "",
       method: "",
       error: "",
       validationError: ""
     };
   }

   resetState() {
     this.setState({
       target: "",
       method: "",
       error: "",
       validationError: ""
     });
   }

   updateSuiteModified() {
     this.props.action.updateSuite({
       modified: true
     });
     this.props.action.autosaveSuite();
   }


  handleSubmit = ( e = null ) => {
    const { record, closeModal, resetSubmitted } = this.props,
          target = this.state.target || record.target,
          method = this.state.method || record.method,
          schema = getSchema( target, method );

    e && e.preventDefault();
    resetSubmitted();

    this.props.form.validateFieldsAndScroll( ( err, values ) => {
      if ( !err ) {

        if ( schema.hasOwnProperty( "validate" ) ) {
          const validationError = schema.validate( values );
          this.setState({ validationError: "" });
          if ( validationError ) {
            this.setState({ validationError });
            return;
          }
        }

        this.props.action[ record.id ? "updateCommand" : "addCommand" ]({
          id: record.id,
          testId: record.testId,
          groupId: record.groupId,
          target: values.target,
          method: values.method,
          params: values.params,
          assert: values.assert,
          comment: values.comment
        });

        this.updateSuiteModified();
        this.resetState();
        closeModal();
      }
    });
  }

  changeTarget = ( target ) => {
    this.setState({
      target
    });
  }

  changeMethod = ( method ) => {
    const hasGoto = this.checkTestHasGoto();

//    if ( this.checkTestHasAssertPerfomanceAssetWeight() && hasGoto ) {
//      return this.setState({
//        method,
//        error: `When asserting total weight of loaded assets, for clear results, `
//          + ` have in a test case no other requests, but page.assertPerfomanceAssetWeight`
//      });
//    }

    if ( !TEST_LEADING_METHODS.includes( method ) && !hasGoto ) {
      return this.setState({
        method,
        error: `You shall start the test with page.goto. `
          + `It can be prepended by page.emulate or page.setViewport though`
      });
    }
    this.setState({
      method,
      error: ""
    });
  }

  checkTestHasAssertPerfomanceAssetWeight = () => {
    return this.props.commands.find( command => ( command.method === "assertPerfomanceAssetWeight" ) );
  }

  checkTestHasGoto = () => {
    return this.props.commands.find( command => ( command.method === "goto" ) );
  }

//  componentDidMount() {
//    ipcRenderer.on( E_RESET_FORM, ( ...args ) => {
//      this.props.form.resetFields( args[ 1 ] );
//    });
//  }


  componentDidUpdate( prevProps ) {
    if ( !prevProps.submitted && this.props.submitted ) {
      this.handleSubmit();
    }
  }

  isSavedOne( record ) {
    // not changed for another method
    if ( this.state.target === "" && this.state.method === "" ) {
      return true;
    }
    // returned back after jumping
    if ( this.state.target && this.state.target !== record.target ) {
      return false;
    }
    if ( this.state.method && this.state.method !== record.method ) {
      return false;
    }
    return true;
  }

  renderCommentField( record ) {
    const { getFieldDecorator } = this.props.form;
    return ( <details>
              <summary>Comment</summary>
              <div  className="command-form__noncollapsed">
              <FormItem className="ant-form-item--layout">
        { getFieldDecorator( "comment", {
          initialValue: record.comment
        } )( <TextArea placeholder="Here you can describe your intent"
          rows={ 2 }
          onKeyPress={ ( e ) => this.onKeyPress( e, this.handleSubmit ) } /> ) }
        </FormItem>
        </div>
        </details> );
  }

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form,
          { targets, record } = this.props,
          target = this.state.target || record.target,
          method = this.state.method || record.method,
          schema = getSchema( target, method ),
          Assert = schema && schema.assert ? schema.assert.node : null,
          assertOptions = schema && schema.assert ? schema.assert.options : null,
          safeRecord = this.isSavedOne( record )
            ? {
              params: {},
              assert: {},
              ...record
            }
            : {
              ...record,
              params: {},
              assert: {}
            };

    return (
      <ErrorBoundary>
        <Form onSubmit={this.handleSubmit} className="command-form" id="cCommandForm">
          <If exp={ this.state.error }>
            <Alert
              description={ this.state.error }
              type="warning"
              closable />
          </If>
          <Row gutter={24}>
            <Col xl={8} lg={12} md={24}>
              <FormItem label="Target">
                {getFieldDecorator( "target", {
                  initialValue: record.target,
                  rules: [{
                    required: true,
                    message: "Please select target"
                  }]
                })(
                  <TargetSelect
                    setFieldsValue={ setFieldsValue }
                    initialValue={ record.target }
                    changeTarget={ this.changeTarget } />
                )}
              </FormItem>
            </Col>

            <Col xl={8} lg={12} md={24}>
              <FormItem label="Method">
                {getFieldDecorator( "method", {
                  initialValue: record.method,
                  rules: [{
                    required: true,
                    message: "Please select method"
                  }]
                })(
                  !target ? <Input disabled />
                    : (
                    target === "page"
                      ? <PageMethodSelect
                        initialValue={ record.method }
                        changeMethod={ this.changeMethod }
                        setFieldsValue={ setFieldsValue } />
                      : <ElementMethodSelect
                        initialValue={ record.method }
                        changeMethod={ this.changeMethod }
                        setFieldsValue={ setFieldsValue } />
                    )
                )}
              </FormItem>
            </Col>

          </Row>

          { ( schema && schema.description ) ? (
            <Description schema={ schema } target={ target } />
          ) : null }

          { schema && this.renderCommentField( record ) }

          <If exp={ this.state.validationError }>
            <Alert
              description={ this.state.validationError }
              type="error"
              closable />
          </If>

          <If exp={ schema && schema.params && schema.params.length }>
            <div className="command-form ">
              <ErrorBoundary>
                <ParamsFormBuilder
                  schema={ schema }
                  targets={ targets }
                  record={ safeRecord }
                  onSubmit={ this.handleSubmit }
                  form={ this.props.form } />
              </ErrorBoundary>
            </div>
          </If>

          <If exp={ Assert }>
            <fieldset className="command-form ">
              <legend>
                <span>Assertions</span>
              </legend>
              <ErrorBoundary>
                { Assert ? <Assert
                  targets={ targets }
                  options={ assertOptions }
                  form={ this.props.form }
                  record={ safeRecord } /> : null }
              </ErrorBoundary>
            </fieldset>
          </If>


        </Form>
      </ErrorBoundary>
    );
  }
}
