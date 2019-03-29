import React from "react";
import PropTypes from "prop-types";
import { Form, Input, InputNumber, Checkbox, Row, Col, Select, Button } from "antd";
import Tooltip from "component/Global/Tooltip";
import { FILE, INPUT, INPUT_NUMBER, CHECKBOX, SELECT, TEXTAREA } from "component/Schema/constants";
import { ipcRenderer } from "electron";
import { E_BROWSE_FILE, E_FILE_SELECTED } from "constant";
const FormItem = Form.Item,
      Option = Select.Option,


      getLabel = ( desc, tooltip ) => (
        <span>
          { desc }
          <Tooltip
            title={ tooltip }
            icon="question-circle"
          />
        </span>
      );

export class ParamsFormBuilder extends React.Component {

  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
      setFieldsValue: PropTypes.func.isRequired
    }),

    onSubmit: PropTypes.func.isRequired,
    record: PropTypes.object.isRequired,
    schema: PropTypes.any
  }

  onKeyPress = ( e, cb ) => {
    switch ( e.key ){
    case "Enter":
      cb( e );
      return;
    }
  }

  onClickSelectFile = ( e, item ) => {
    e.preventDefault();
    this.filepathName = item.name;
    ipcRenderer.send( E_BROWSE_FILE, "" );
  }

  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    ipcRenderer.on( E_FILE_SELECTED, ( ...args ) => {
      const selectedFile = args[ 1 ];
      setFieldsValue({
        [ this.filepathName ]: selectedFile
      });
    });
  }

  renderControl = ( item ) => {
    const { setFieldsValue } = this.props.form,
          { onSubmit } = this.props,
          onSelect = ( value ) => {
            setFieldsValue({ [ item.name ]: value });
          };
    switch ( item.control ) {
    case INPUT:
      return ( <Input placeholder={ item.placeholder }
        onKeyPress={ ( e ) => this.onKeyPress( e, onSubmit ) } /> );
    case INPUT_NUMBER:
      return ( <InputNumber
        onKeyPress={ ( e ) => this.onKeyPress( e, onSubmit ) } /> );
    case TEXTAREA:
      return ( <Input.TextArea
        placeholder={ item.placeholder }
        rows={ 4 } /> );
    case FILE:
      return ( <Input onClick={ this.onClickSelectFile } disabled  /> );
    case SELECT:
      return ( <Select
        showSearch
        placeholder={ item.placeholder }
        optionFilterProp="children"
        onSelect={ onSelect }
        filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
      >
        {
          item.options.map( ( option, inx ) => {
            return typeof option === "string"
              ? ( <Option key={inx} value={ option }>{ option }</Option> )
              : ( <Option key={inx} value={ option.value }>{ option.description }</Option> );
          })

        }
      </Select> );
    case CHECKBOX:
      return ( <Checkbox>
        { item.label }
        { item.tooltip && ( <Tooltip
          title={ item.tooltip }
          icon="question-circle"
        /> )}

      </Checkbox> );
    default:
      return null;
    }
  }

  getInitialValue( item ) {
    const { record } = this.props,
          initialValue = item.control === CHECKBOX ? false : item.initialValue,
          key = item.name.replace( /^params\./, "" );

    return ( ( record.params && record.params.hasOwnProperty( key ) )
      ? record.params[ key ]
      : initialValue );
  }

  renderFormItem = ( item, inx ) => {
    const { getFieldDecorator } = this.props.form,
          labelNode = item.tooltip ? getLabel( item.label, item.tooltip ) : item.label,
          initialValue = this.getInitialValue( item ),
          decoratorOptions =  {
            initialValue,
            rules: item.rules
          };

    if ( item.control === CHECKBOX ) {
      decoratorOptions.valuePropName = ( initialValue ? "checked" : "data-ok" );
      decoratorOptions.initialValue = true;
    }

    return (
      <FormItem
        label={ item.control !== CHECKBOX ? labelNode : "" }
        key={ `item${inx}` }>
        { getFieldDecorator( item.name, decoratorOptions )( this.renderControl( item ) ) }
        { item.description ? <div className="command-opt-description">{ item.description }</div> : "" }
        { item.control === FILE && <Button
          onClick={ ( e ) => this.onClickSelectFile( e, item ) }>Select file</Button>
        }
      </FormItem> );
  }

  renderRow = ( row, inx ) => {

    const rowNode = (
      <Row gutter={24} key={ `row${inx}` } className={ row.inline ? "ant-form-inline edit-command-inline" : null }>
        <Col span={ row.span || 24} >
          { row.items.map( this.renderFormItem ) }
        </Col>
      </Row> );

    return row.legend ? (
      <fieldset className="command-form__fieldset"  key={ `fs${inx}` }>
        <legend>
          <span>{ row.legend }</span>
          { row.tooltip && ( <Tooltip
            title={ row.tooltip }
            icon="question-circle"
          /> )}
        </legend>
        { row.description && ( <p>{ row.description }</p> )}
        { rowNode }
      </fieldset> ) : rowNode;
  }

  render() {
    const { schema } = this.props;

    return (
      <React.Fragment>
        { schema.params.map( this.renderRow ) }
      </React.Fragment>
    );
  }
}