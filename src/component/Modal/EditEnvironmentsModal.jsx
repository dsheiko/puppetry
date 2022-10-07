import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input, Table, Icon, Popconfirm } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import * as classes from "./classes";
import { MODAL_DEFAULT_PROPS } from "constant";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const FormItem = Form.Item,
      connectForm = Form.create();

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.editEnvironmentsModal,
        environments: state.project.environments
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
@connectForm
export class EditEnvironmentsModal extends AbstractForm {


  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      saveProject: PropTypes.func.isRequired
    }),
    isVisible: PropTypes.bool.isRequired,
    environments: PropTypes.array
  }

  constructor( props ) {
    super( props );
    this.columns = [
      {
        title: "Environment",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Action",
        key: "action",
        render: ( text, record ) => (
          <span>
            <Popconfirm title="Sure to delete?"
              onConfirm={() => this.remove( record )}>
              <a className="link--action" tabIndex={-2} role="button">Delete</a>
            </Popconfirm>
          </span>
        )
      }
    ];
  }

  close() {
    this.props.action.setApp({ editEnvironmentsModal: false });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  remove( record ) {
    if ( this.props.environments.length < 2 ) {
      return smalltalk.alert( "Problem", "You need at least one environment in the project" );
    }
    this.props.action.removeEnv( record.name );
    this.props.action.saveProject();
  }

  onClickOk = async ( e ) => {
    const { validateFields, resetFields } = this.props.form,
          { addEnv, saveProject } = this.props.action;

    e.preventDefault();

    validateFields( async ( err, values ) => {
      const { name } = values;
      if ( err ) {
        return;
      }
      addEnv( name );
      resetFields();
      saveProject();
    });
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
    const { isVisible, environments } = this.props,
          { getFieldDecorator } = this.props.form,
          data = environments.map( item => ({ name: item, key: item }) );

    return (
      <ErrorBoundary>
        <Modal
          title="Edit Environments"
          visible={ isVisible }
          closable
          { ...MODAL_DEFAULT_PROPS }
          onCancel={this.onClickCancel}
          footer={[
            ( <Button
              className={ classes.BTN_CANCEL }
              key="back"
              onClick={this.onClickCancel}>Close</Button> )
          ]}
        >

          <Table
            columns={ this.columns }
            dataSource={ data }
            pagination={{ pageSize: 4 }}
          />

          { isVisible ? <Form layout="inline">

            <FormItem>
              { getFieldDecorator( "name", {
                rules: [
                  {
                    validator: ( rule, value, callback ) => {
                      value = value ? value.trim() : "";
                      if ( value.length < 3 ) {
                        return callback( "The value shall not be less than 3 characters" );
                      }
                      if ( value.length > 32 ) {
                        return callback( "The value shall not be more than 32 characters" );
                      }
                      callback();
                    }
                  },
                  {
                    validator: ( rule, value, callback ) => {
                      callback( environments.includes( value ) ? "This environment already exists" : undefined );
                    }
                  },
                  {
                    transform: ( value ) => value ? value.trim() : ""
                  }
                ]
              })(
                <Input placeholder="e.g. development"
                  onKeyPress={ ( e ) => this.onKeyPress( e, this.onClickOk ) } />
              )}
            </FormItem>
            <Form.Item>
              <Button
                id="cEditEnvModalAdd"
                onClick={ this.onClickOk }><Icon type="plus" />Add environment
              </Button>
            </Form.Item>
          </Form> : this.renderLoading }
        </Modal>
      </ErrorBoundary>
    );
  }
}
