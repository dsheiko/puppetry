import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Switch, Input, InputNumber, Checkbox } from "antd";
import { getAssertion } from "./helpers";

const FormItem = Form.Item,
      ASSETS = [
        { name: "JavaScript", key: "js" },
        { name: "CSS", key: "css" }
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
    disabled: {}
  }

  onSelectAssertion = ( value ) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ operator: value });
  }

  onSwitchChange = ( checked, assetType ) => {
    this.setState({
      disabled: {
        [ assetType ]: !checked
      }
    });
  }
//
//  getDisabled( data ) {
//    const disabled = {};
//    // If the sate changed
//    if ( this.state.disabledUpdated ) {
//      console.log("#1");
//      return this.state.disabled;
//    }
//    if ( data.hasOwnProperty( "_enabled" ) ) {
//      console.log("#2");
//      return data._enabled;
//    }
//    console.log("#3");
//    return ASSETS.reduce(( carry, asset ) => {
//      carry[ asset.key ] = asset.key in data ? !parseInt( data[ asset.key ], 10 ) : true;
//      return carry;
//    }, {});
//  }

  componentDidMount() {
    const data = getAssertion( this.props.record );
    console.log({data});
    if ( data.hasOwnProperty( "_enabled" ) ) {
      console.log("#1");
      const disabled = ASSETS.reduce(( carry, asset ) => {
        carry[ asset.key ] = !data._enabled[ asset.key ];
        return carry;
      }, {} );
      this.setState({ disabled });
    }
    console.log("#2");
    const disabled = ASSETS.reduce(( carry, asset ) => {
      carry[ asset.key ] = asset.key in data ? !parseInt( data[ asset.key ], 10 ) : true;
      return carry;
    }, {} );
    this.setState({ disabled });
  }


  render () {
    const { getFieldDecorator } = this.props.form,
          { record, targets } = this.props,
          data = getAssertion( record ),
          disabled = this.state.disabled;
        console.log(">", disabled);
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

        <Row gutter={24} className="ant-form-inline">
        <table className="assert-perf-table">

          <tbody>
          { ASSETS.map( asset => (<tr key={ asset.key } className={ disabled[ asset.key ] ? "assert-row-disabled" : "" }>
              <td>
              { disabled[ asset.key ] ? "true" : "false"}
                <FormItem>
                  <FormItem className="assert-perf-size">
                    { getFieldDecorator( `assert._enabled.${ asset.key }`, {

                    })( <Switch defaultChecked={ !disabled[ asset.key ] } onChange={ ( checked ) => this.onSwitchChange( checked, asset.key  ) } /> )
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
                    rules: [
                     {
                       validator: ( rule, value, callback ) => {
                       const re = /^\d+$/;
                       console.log(">--", { value, disabled, key: asset.key} );
                        if ( disabled[ asset.key ] )  {
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
