import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Switch, Input, InputNumber, Checkbox } from "antd";
import { getAssertion } from "./helpers";

const FormItem = Form.Item,
      ASSETS = [
        { name: "JavaScript", key: "script" },
        { name: "CSS", key: "stylesheet" },
        { name: "Images", key: "image" },
        { name: "Media", key: "media" },
        { name: "Fonts", key: "font" },
        { name: "XHR/fetch", key: "xhr" }
      ];

export class AssertAssertWeight extends React.Component {

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
  }

  static normalizeEnabled( data ) {
    ASSETS.forEach( asset => {
      if ( typeof data._enabled[ asset.key ] === "undefined" ) {
        data._enabled[ asset.key ] = false;
      }
    });
    return data;
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record, targets } = this.props,
          data = AssertAssertWeight.normalizeEnabled( getAssertion( record ) ),
          enabled = this.state.enabled;

    return (
      <React.Fragment>
        <div className="is-invisible">
            <FormItem>
              { getFieldDecorator( "assert.assertion", {
                initialValue: "assertAssetWeight"
              })( <Input readOnly /> ) }
            </FormItem>
        </div>

        <h3>Quantity-based metrics based on asset weight</h3>
        <div>Assert the total (encoded) size of a type of assets doesn't exeed a given value (in KB)</div>
        <div>Assets loaded from the cache have 0 size</div>

        <Row gutter={24} className="ant-form-inline">
        <table className="assert-perf-table">

          <tbody>
          { ASSETS.map( asset => (<tr key={ asset.key } className={ enabled[ asset.key ] ? "" : "assert-row-disabled" }>
              <td>
                <FormItem>
                  <FormItem className="assert-perf-size">
                    { getFieldDecorator( `assert._enabled.${ asset.key }`, {
                      initialValue: data._enabled[ asset.key ],
                      valuePropName: ( data._enabled[ asset.key ] ? "checked" : "data-ok" )
                    })( <Switch
                      onChange={ ( checked ) => this.onSwitchChange( checked, asset.key  ) } /> )
                    }
                  </FormItem>

                </FormItem>
              </td>
              <td>
                  { asset.name }
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
                  })( <Input  addonAfter="KB" /> )
                  }
                </FormItem>
            </td>
          </tr>)) }


        </tbody>
      </table>
      </Row>

      </React.Fragment> );
  }

}
