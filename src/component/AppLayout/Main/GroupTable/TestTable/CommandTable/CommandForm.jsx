import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Alert, Input, Checkbox } from "antd";
import TargetSelect from "./TargetSelect";
import ElementMethodSelect from "./ElementMethodSelect";
import PageMethodSelect from "./PageMethodSelect";
import { ParamsFormBuilder } from "./Params/ParamsFormBuilder";
import If from "component/Global/If";
import { getSchema } from "component/Schema/schema";
import { Description } from "component/Schema/Params/Description";
import ErrorBoundary from "component/ErrorBoundary";
import { result } from "service/utils";

const FormItem = Form.Item,
      connectForm = Form.create(),
      { TextArea } = Input;

@connectForm
export class CommandForm extends React.Component {

   static propTypes = {
     action: PropTypes.shape({
       updateSuite: PropTypes.func.isRequired,
       updateCommand: PropTypes.func.isRequired,
       autosaveSuite: PropTypes.func.isRequired
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
          comment: values.comment,
          failure: "",
          waitForTarget: values.waitForTarget || false
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
    this.setState({
      method,
      error: ""
    });
  }

  checkTestHasAssertPerformanceAssetWeight = () => {
    return this.props.commands.find( command => ( command.method === "assertPerformanceAssetWeight" ) );
  }

  checkTestHasGoto = () => {
    return this.props.commands.find( command => ( command.method === "goto" ) );
  }


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

  renderExtraFields( record ) {
    const { getFieldDecorator } = this.props.form,
          target = this.state.target || record.target,
          method = this.state.method || record.method,
          currentTarget = target === "page" ?  null
            : this.props.targets.find( data => data.target === target );

    return ( <div className="command-form-extra-fields"><details>
      <summary>Comment</summary>
      <div  className="command-form__noncollapsed">
        <FormItem className="ant-form-item--layout">
          { getFieldDecorator( "comment", {
            initialValue: record.comment
          })( <TextArea placeholder="Here you can describe your intent"
            rows={ 2 } /> ) }
        </FormItem>
      </div>
    </details>

    { ( currentTarget && !currentTarget.ref && method !== "assertVisible" && method !== "waitForTarget" )
      ? <div className="wait-for-target">
        <FormItem className="ant-form-item--layout">
          { getFieldDecorator( "waitForTarget", {
            initialValue: result( record, "waitForTarget", false ),
            valuePropName: "checked"
          })( <Checkbox>wait for the target</Checkbox> ) }
        </FormItem>
      </div> :  null }
    </div> );
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
                { getFieldDecorator( "target", {
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

          { schema && this.renderExtraFields( record ) }

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
                  onPressEnter={ this.handleSubmit }
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