import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input, Row, Col, Collapse } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { normalizeFilename } from "service/io";
import { ruleValidateGenericString } from "service/utils";
import * as classes from "./classes";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create(),
      normalizeSuiteName = ( val ) => {
        return normalizeFilename( val ).toLowerCase();
      },
      Panel = Collapse.Panel;

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
      const { title, filename } = values;
      if ( err ) {
        return;
      }
      await createSuite( filename, title );
      setApp({ newSuiteModal: false });
    });
  }

  onNameChange = ( e ) => {
    this.setState({ displayFilename: normalizeSuiteName( e.target.value ) });
  }

  render() {
    const { isVisible } = this.props,
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="New Suite"
          visible={ isVisible }
          className="c-new-suite-modal"
          disabled={ this.hasErrors( getFieldsError() )  }
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

          <Form >
            <FormItem  label="Suite title">
              { getFieldDecorator( "title", {
                initialValue: "",
                rules: [{
                  required: true,
                  message: "Please enter suite title"
                },
                {
                  validator: ruleValidateGenericString
                },
                {
                  transform: ( value ) => value.trim()
                }]
              })(
                <Input onChange={ this.onNameChange } placeholder="e.g. Main page"
                  onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
              )}
            </FormItem>
            <p>Optionally you can specify suite file name manually, otherwise it will be generated automatically
              <If exp={ this.state.displayFilename }>
                { " " } as { " " } <b className="color--primary">
                  <i id="cNewSuiteModalFilenamePreview">{ this.state.displayFilename }.json</i></b>
              </If>
            </p>
            <Collapse>
              <Panel header="Specify filename">
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
              </Panel>
            </Collapse>


          </Form>

        </Modal>
      </ErrorBoundary>
    );
  }
}

