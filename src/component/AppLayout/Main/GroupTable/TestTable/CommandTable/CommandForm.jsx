import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Alert } from "antd";
import { TargetSelect } from "./TargetSelect";
import { TargetMethodSelect } from "./TargetMethodSelect";
import { PageMethodSelect } from "./PageMethodSelect";
import { ParamsFormBuilder } from "./Params/ParamsFormBuilder";
import If from "component/Global/If";
import { getSchema } from "component/Schema/schema";
import { Description } from "component/Schema/Params/Description";


const FormItem = Form.Item,
      connectForm = Form.create(),
      TEST_LEADING_METHODS = [ "emulate", "setViewport", "goto" ];

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
     onSubmitted: PropTypes.func.isRequired
   }

   constructor( props ) {
     super( props );
     this.state = {
       target: "",
       method: "",
       error: ""
     };
   }

   updateSuiteModified() {
     this.props.action.updateSuite({
       modified: true
     });
   }


  handleSubmit = ( e = null ) => {
    const { record, closeModal, onSubmitted } = this.props;
    e && e.preventDefault();
    this.props.form.validateFieldsAndScroll( ( err, values ) => {
      if ( !err ) {
        onSubmitted();
        this.updateSuiteModified();
        this.props.action[ record.id ? "updateCommand" : "addCommand" ]({
          id: record.id,
          testId: record.testId,
          groupId: record.groupId,
          target: values.target,
          method: values.method,
          params: values.params,
          assert: values.assert
        });

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
    if ( !TEST_LEADING_METHODS.includes( method ) && !this.checkTestHasGoto() ) {
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

  checkTestHasGoto = () => {
    return this.props.commands.find( command => ( command.method === "goto" ) );
  }


  componentDidUpdate( prevProps ) {
    if ( !prevProps.submitted && this.props.submitted ) {
      this.handleSubmit();
    }
  }

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form,
          { targets, record } = this.props,
          target = this.state.target || record.target,
          method = this.state.method || record.method,
          schema = getSchema( target, method ),
          Assert = schema && schema.assert ? schema.assert.node : null;

    return (
      <Form onSubmit={this.handleSubmit} className="command-form">
        <If exp={ this.state.error }>
          <Alert
            message="Notice"
            description={ this.state.error }
            type="warning"
            closable />
        </If>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={24}>
            <FormItem label="Target"
              help={ targets.length ? null: "Consider adding test targets in the suite" }>
              {getFieldDecorator( "target", {
                initialValue: record.target,
                rules: [{
                  required: true,
                  message: "Please select target"
                }]
              })(
                <TargetSelect
                  setFieldsValue={ setFieldsValue }
                  targets={ targets }
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
                target === "page"
                  ? <PageMethodSelect
                    initialValue={ record.method }
                    changeMethod={ this.changeMethod }
                    setFieldsValue={ setFieldsValue } />
                  : <TargetMethodSelect
                    initialValue={ record.method }
                    changeMethod={ this.changeMethod }
                    setFieldsValue={ setFieldsValue } />
              )}
            </FormItem>
          </Col>

        </Row>

        <If exp={ schema && schema.description }>
          <Description schema={ schema } target={ target } />
        </If>

        <If exp={ schema && schema.params.length }>
          <fieldset className="command-form ">
            <legend>
              <span>Parameters</span>
            </legend>

            <ParamsFormBuilder schema={ schema } targets={ targets } record={ record } form={ this.props.form } />

          </fieldset>
        </If>

        <If exp={ Assert }>
          <fieldset className="command-form ">
            <legend>
              <span>Assertions</span>
            </legend>
            { Assert ? <Assert
              targets={ targets }
              form={ this.props.form }
              record={record} /> : null }
          </fieldset>
        </If>

      </Form>
    );
  }
}
