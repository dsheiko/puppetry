import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input, Row, Col, Collapse } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { normalizeFilename } from "service/io";
import { ruleValidateGenericString } from "service/utils";
import * as classes from "./classes";
import { MODAL_DEFAULT_PROPS } from "constant";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classNames from "classnames";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create(),
      normalizeSuiteName = ( val ) => {
        return normalizeFilename( val ).toLowerCase();
      },
      Panel = Collapse.Panel;

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.newSuiteModal
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )

@connectForm
export class NewSuiteModal extends AbstractForm {

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      createSuite: PropTypes.func.isRequired
    }),

    isVisible: PropTypes.bool.isRequired
  }

  state = {
    displayFilename: ""
  };

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ newSuiteModal: false });
  }

  onClickOk = ( e ) => {
    e.preventDefault();
    this.createSuite();
  }

  createSuite = () => {
    const { createSuite, setApp } = this.props.action,
          { validateFields } = this.props.form;

    validateFields( async ( err, values ) => {
      if ( !values.filename ) {
        values.filename = normalizeSuiteName( values.title );
      }
      const { filename } = values;
      if ( err ) {
        return;
      }
      await createSuite( filename, filename );
      setApp({ newSuiteModal: false });
    });
  }

  onNameChange = ( e ) => {
    this.setState({ displayFilename: normalizeSuiteName( e.target.value ) });
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
    const { isVisible } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="New Suite"
          visible={ isVisible }
          className={ classNames({
            "c-new-suite-modal": true,
            "is-opaque": !isVisible
          }) }
          disabled={ this.hasErrors( getFieldsError() )  }
          closable
          onCancel={this.onClickCancel}
          { ...MODAL_DEFAULT_PROPS }
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

          { isVisible ? <Form >
           
            <FormItem
                label={ <span>Suite filename <span className="is-optional">(without extension)</span></span> }
              >
                { getFieldDecorator( "filename", {
                  initialValue: "",
                  rules: [
                    {
                      pattern: /^[0-9a-zA-Z_\-\.]{3,250}$/,
                      message: "Invalid filename"
                    }]
                })(
                  <Row>
                    <Col span={ 22 }>
                      <Input placeholder="e.g. main-page"
                        onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
                    </Col>
                    <Col span={ 2 }>
                      { " " }.json
                    </Col>
                  </Row>
                )}
              </FormItem>

          </Form> : null }

        </Modal>
      </ErrorBoundary>
    );
  }
}

