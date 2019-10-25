/*eslint spellcheck/spell-checker: 0*/
/*eslint react/no-unescaped-entities: 0*/
import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Switch, Input } from "antd";
import { getAssertion } from "./helpers";
import { result } from "service/utils";
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

export class AssertPerformanceMetrics extends React.Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    targets: PropTypes.arrayOf( PropTypes.object ),
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired,
      getFieldValue: PropTypes.func.isRequired
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
          { record } = this.props,
          data = AssertPerformanceMetrics.normalizeEnabled( getAssertion( record ) ),
          enabled = this.state.enabled;

    return (
      <React.Fragment>
        <div className="is-invisible">
          <FormItem>
            { getFieldDecorator( "assert.assertion", {
              initialValue: "assertPerformanceTiming"
            })( <Input readOnly /> ) }
          </FormItem>
        </div>

        <h3>Milestone timings based on the user-experience loading a page</h3>
        <div>Assert the time (microseconds) of a page loading stage doesn't exceed a given limit</div>


        <Row gutter={24} className="ant-form-inline">
          <table className="assert-perf-table">

            <tbody>
              { METRICS.map( asset => ( <tr key={ asset.key }
                className={ result( enabled, asset.key, false ) ? "" : "assert-row-disabled" }>
                <td>
                  <FormItem>
                    <FormItem className="perf-switch">
                      { getFieldDecorator( `assert._enabled.${ asset.key }`, {
                        initialValue: result( data._enabled, asset.key, false ),
                        valuePropName: ( result( data._enabled, asset.key, false ) ? "checked" : "data-ok" )
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
                            if ( !enabled[ asset.key ])  {
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
                    })( <Input addonAfter="μs" /> )
                    }
                  </FormItem>
                </td>
                <td></td>
              </tr> ) ) }


            </tbody>
          </table>
        </Row>

      </React.Fragment> );
  }

}
