import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Switch, Input, InputNumber, Checkbox } from "antd";
import { getAssertion } from "./helpers";
import { propVal } from "service/utils";
import Tooltip from "component/Global/Tooltip";

const FormItem = Form.Item,
      METRICS = [
        { name: "Page loading", key: "loading", desc: `The whole process of navigation and page load` },
        { name: "Redirection", key: "redirection", desc: `The time taken by document request redirections` },
        { name: "Network latency", key: "network", desc: `The time taken to fetch app cache, lookup domain, `
          + `establish TCP connection, send request, receive response` },
        { name: "Page processing", key: "processing",
          desc: `The time taken for page load once the page is received from the server` }
      ];

export class AssertPerfomanceMetrics extends React.Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    targets: PropTypes.arrayOf( PropTypes.object ),
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  state = {
    enabled: {}
  }

  onSelectAssertion = ( value ) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ operator: value });
  }

  onSwitchChange = ( checked, assetType ) => {
    const { getFieldValue } = this.props.form,
          enabled = getFieldValue( "assert._enabled" );
    enabled[ assetType ] = checked;
    this.setState({
      enabled
    });
  }

  componentDidMount() {
    const data = getAssertion( this.props.record );
    if ( data.hasOwnProperty( "_enabled" ) ) {
      this.setState({ enabled: data._enabled });
      return;
    }
    this.setState({
      enabled: METRICS.reduce( ( carry, asset ) => {
        carry[ asset.key ] = false;
        return carry;
      }, {})
    });
  }

  static normalizeEnabled( data ) {
    if ( !data._enabled ) {
      return data;
    }
    METRICS.forEach( asset => {
      if ( typeof data._enabled[ asset.key ] === "undefined" ) {
        data._enabled[ asset.key ] = false;
      }
    });
    return data;
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record, targets } = this.props,
          data = AssertPerfomanceMetrics.normalizeEnabled( getAssertion( record ) ),
          enabled = this.state.enabled;

    return (
      <React.Fragment>
        <div className="is-invisible">
            <FormItem>
              { getFieldDecorator( "assert.assertion", {
                initialValue: "assertPerfomanceTiming"
              })( <Input readOnly /> ) }
            </FormItem>
        </div>

        <h3>Milestone timings based on the user-experience loading a page</h3>
        <div>Assert the time of a page loading stage doesn't exeed a given limit</div>


        <Row gutter={24} className="ant-form-inline">
        <table className="assert-perf-table">

          <tbody>
          { METRICS.map( asset => (<tr key={ asset.key }
          className={ propVal( enabled, asset.key, false ) ? "" : "assert-row-disabled" }>
              <td>
                <FormItem>
                  <FormItem className="perf-switch">
                    { getFieldDecorator( `assert._enabled.${ asset.key }`, {
                      initialValue: propVal( data._enabled, asset.key, false ),
                      valuePropName: ( propVal( data._enabled, asset.key, false ) ? "checked" : "data-ok" )
                    })( <Switch
                      onChange={ ( checked ) => this.onSwitchChange( checked, asset.key  ) } /> )
                    }
                  </FormItem>

                </FormItem>
              </td>
              <td>
                  { asset.name }<Tooltip
        title={ asset.desc }
        icon="question-circle"
        pos="up-left"
      />
              </td>
              <td>
                &lt;
              </td>
              <td>
                <FormItem className="assert-perf-size">
                  { getFieldDecorator( `assert.${ asset.key }`, {
                    initialValue: data[ asset.key ],
                    rules: [
                     {
                       validator: ( rule, value, callback ) => {
                          const re = /^\d+$/;
                           if ( !enabled[ asset.key ] )  {
                             return callback();
                           }
                           value = value ? value.trim() : "";
                           if ( !re.test( value ) ) {
                             return callback( "Value is not a number" );
                           }
                           callback();
                       }
                     }
                  ]
                  })( <Input addonAfter="ms" /> )
                  }
                </FormItem>
            </td>
            <td></td>
          </tr>)) }


        </tbody>
      </table>
      </Row>

      </React.Fragment> );
  }

}
