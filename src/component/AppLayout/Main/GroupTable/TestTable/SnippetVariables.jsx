import React from "react";

import ErrorBoundary from "component/ErrorBoundary";
import AbstractForm from "component/AbstractForm";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Row, Col, Collapse, Table, Button, Input } from "antd";

const connectForm = Form.create(),
      Panel = Collapse.Panel;

@connectForm
export class SnippetVariables extends AbstractForm {
  constructor( props ) {
    super( props );

    this.state = {
      variables: Object.entries( props.record.variables || []).map( ([ name, value ]) => ({
        name, value, editing: false, key: name
      }) )
    };

    this.columns = [
      {
        title: "Variable",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value"
      },
      {
        title: "Action",
        key: "action",
        render: ( text, record ) => (
          <a role="button"  tabIndex={-1} onClick={( e ) => this.onRemoveVariable( e, record ) }>Delete</a> )
      }
    ];
  }

  onRemoveVariable = ( e, record ) => {
    e.preventDefault();
    this.setState({
      variables: this.state.variables.filter( ( item ) => item.name !== record.name )
    });
  }

  onAddVariable = ( e ) => {
    const { validateFields, resetFields } = this.props.form;
    e.preventDefault();
    validateFields( ( err, values ) => {
      const { name, value } = values;
      if ( !name || !value ) {
        return;
      }
      if ( err || this.state.variables.find( item => item.name === value ) ) {
        return;
      }
      resetFields();
      const record = { name, value, editing: false, key: name },
            variables = [ ...this.state.variables, record ];

      // State variables to record variables
      this.props.onChanged( variables.reduce( ( carry, item ) => ({
        ...carry,
        [ item.name ]: item.value
      }), {}) );

      this.setState({
        variables
      });

    });
  }

  render() {
    const { getFieldDecorator } = this.props.form,
          { variables } = this.state;

    return (
      <ErrorBoundary>

        <Collapse>
          <Panel header="Local Template Variables (optional)" key="1">
            <p>You can assign variables that will be available as
              { "" }<a href="https://docs.puppetry.app/template" onClick={ this.onExtClick }>
                { "" } template expressions</a>{ "" } in the snippet</p>
            <Form>
              <Row gutter={4}>
                <Col span={10}>
                  <Form.Item >
                    { getFieldDecorator( "name", {
                      rules: [
                        {
                          required: true,
                          message: `Field is required.`
                        },
                        {
                          validator: ( rule, value, callback ) => {
                            const reConst = /^[A-Z_\-0-9]+$/g;
                            if ( !value ) {
                              callback( `Field is required.` );
                            }
                            if ( !value.match( reConst ) ) {
                              callback( `Shall be in all upper case with underscore separators` );
                            }
                            if ( this.state.variables.find( item => item.name === value ) ) {
                              callback( `Variable already exists` );
                            }

                            callback();
                          }
                        }
                      ]
                    })( <Input placeholder="Variable name" onPressEnter={ this.onAddVariable } /> )}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item >
                    { getFieldDecorator( "value", {
                      rules: [
                        {
                          required: true,
                          message: `Field is required.`
                        }
                      ]
                    })( <Input placeholder="Variable value" onPressEnter={ this.onAddVariable } /> )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item >
                    <Button onClick={ this.onAddVariable }>Add</Button>
                  </Form.Item>
                </Col>
              </Row>
              <Table columns={ this.columns } dataSource={ variables } pagination={{ pageSize: 3 }} />
            </Form>
          </Panel>
        </Collapse>


      </ErrorBoundary>
    );
  }
}
