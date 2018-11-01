import React from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";
const FormItem = Form.Item;

export class EditableCell extends React.Component {

  static propTypes = {
    dataIndex: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    record: PropTypes.object.isRequired,
    liftFormStateUp: PropTypes.func.isRequired,
    updateRecord: PropTypes.func.isRequired,
    prefixIcon: PropTypes.any
  }

  state = {
    value: "",
    error: ""
  }

  getError( value, dataIndex ) {
    const reConst = /^[A-Z_\-0-9]+$/g;
    if ( !value.trim().length ) {
      return `Shall not be empty`;
    }
    if ( dataIndex ==="target" && !value.match( reConst ) ) {
      return `Shall be in all upper case with underscore separators`;
    }
    return "";
  }

  onChange = ( e ) => {
    const { dataIndex, record, liftFormStateUp } = this.props,
          value = e.target.value,
          state = {
            value,
            error: this.getError( value, dataIndex )
          };

    this.setState( state );
    liftFormStateUp( dataIndex, state, record.id );
  }

  /**
   * Lift state even before first input
   */
  componentDidMount() {
    const { dataIndex, record, liftFormStateUp } = this.props;
    liftFormStateUp( dataIndex, { value: record[ dataIndex ], error: "" }, record.id );
  }

  render() {
    const { placeholder, dataIndex, record, prefixIcon } = this.props,
          { editing } = record,
          error = this.state.error,
          value = this.props.record[ dataIndex ];

    return (
      <div className="editable-cell">
        {
          editing ? (
            <Form className="cell-form">
              <FormItem
                validateStatus={ error ? "error" : "success" }
                help={ error }
              >
                <Input
                  prefix={ prefixIcon || null }
                  defaultValue={value}
                  onChange={this.onChange}
                  placeholder={placeholder}
                  tabIndex={ dataIndex === "select" ? 2 : 1 }
                />
              </FormItem>
            </Form>
          ) : (
            <div className="container--editable-cell">
              { prefixIcon || null }
              { value || " " }
            </div>
          )
        }
      </div>
    );
  }
}