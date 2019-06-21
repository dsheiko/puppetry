import React from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "component/ErrorBoundary";
import { Collapse, Button, Form, Input, InputNumber, Checkbox, Row, Col, Select, Radio, Icon  } from "antd";
import { validate } from "bycontract";
import Tooltip from "component/Global/Tooltip";
import { FILE, TEXTAREA, RADIO_GROUP, INPUT, INPUT_NUMBER, CHECKBOX, SELECT } from "component/Schema/constants";
import { ipcRenderer } from "electron";
import { E_BROWSE_FILE, E_FILE_SELECTED } from "constant";
import Markdown from "component/Global/Markdown";
import { TemplateHelper } from "./TemplateHelper";
import { connect } from "react-redux";


const FormItem = Form.Item,
      { Option } = Select,
      RadioGroup = Radio.Group,
      Panel = Collapse.Panel,

      getLabel = ( desc, tooltip ) => (
        <span>
          { desc }
          <Tooltip
            title={ tooltip }
            icon="question-circle"
          />
        </span>
      ),

      mapStateToProps = ( state ) => ({
        environments: state.project.environments,
        variables: state.project.variables
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      });

@connect( mapStateToProps, mapDispatchToProps )
export class ParamsFormBuilder extends React.Component {

  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
      setFieldsValue: PropTypes.func.isRequired,
      getFieldValue: PropTypes.func.isRequired
    }),
    onSubmit: PropTypes.func.isRequired,
    record: PropTypes.object.isRequired,
    schema: PropTypes.any,
    environments: PropTypes.any,
    variables: PropTypes.any
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

  onTemplateHelperChange = ( name, val ) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    setFieldsValue({
      [ name ]: getFieldValue( name ) + val
    });
  }

   onKeyPress = ( e, cb ) => {
     switch ( e.key ){
     case "Enter":
       cb( e );
       return;
     }
   }

  renderControl = ( field ) => {
    const { setFieldsValue } = this.props.form,
          { onSubmit } = this.props,
          onSelect = ( value ) => {
            setFieldsValue({ [ field.name ]: value });
          },
          inputStyle = field.inputStyle || {};
    switch ( field.control ) {
    case INPUT:
      return ( <Input placeholder={ field.placeholder }
        style={ inputStyle }

        onKeyPress={ ( e ) => this.onKeyPress( e, onSubmit ) } /> );
    case INPUT_NUMBER:
      return ( <InputNumber
        style={ inputStyle }
        onKeyPress={ ( e ) => this.onKeyPress( e, onSubmit ) } /> );
    case TEXTAREA:
      return ( <Input.TextArea
        style={ inputStyle }
        placeholder={ field.placeholder }
        rows={ 4 } /> );
    case FILE:
      return ( <Input style={ inputStyle } onClick={ this.onClickSelectFile } disabled  /> );
    case SELECT:
      return ( <Select
        showSearch
        style={ inputStyle }
        placeholder={ field.placeholder }
        optionFilterProp="children"
        onSelect={ onSelect }
        filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
      >
        {
          field.options.map( ( option, inx ) => {
            return typeof option === "string"
              ? ( <Option key={inx} value={ option }>{ option }</Option> )
              : ( <Option key={inx} value={ option.value }>{ option.description }</Option> );
          })

        }
      </Select> );
    case CHECKBOX:
      return ( <Checkbox>
        { field.label }
        { field.tooltip && ( <Tooltip
          title={ field.tooltip }
          icon="question-circle"
        /> )}

      </Checkbox> );
    case RADIO_GROUP:
      return ( <RadioGroup>
        {
          field.options.map( ( option, inx ) => {
            return typeof option === "string"
              ? ( <Radio key={inx} value={ option }>{ option }</Radio> )
              : ( <Radio key={inx} value={ option.value }>{ option.description }</Radio> );
          })
        }
      </RadioGroup> );
    default:
      return null;
    }
  }

  getInitialValue( field ) {
    const { record } = this.props,
          initialValue = field.control === CHECKBOX ? false : field.initialValue,
          key = field.name.replace( /^params\./, "" );

    return ( ( record.params && record.params.hasOwnProperty( key ) )
      ? record.params[ key ]
      : initialValue );
  }


  renderField = ( field, inx, section ) => {
    const { getFieldDecorator } = this.props.form,
          labelNode = field.tooltip ? getLabel( field.label, field.tooltip ) : field.label,
          initialValue = this.getInitialValue( field ),
          decoratorOptions =  {
            initialValue,
            rules: field.rules
          };

    validate( field, {
      span: "number=",
      template: "boolean=",
      name: "string",
      control: "string",
      label: "string",
      tooltip: "string=",
      placeholder: "string=",
      inputStyle: "object=",
      textareaRows: "number=",
      options: "array=",
      rules: "array="
    });

    if ( field.control === CHECKBOX ) {
      decoratorOptions.valuePropName = ( initialValue ? "checked" : "data-ok" );
      decoratorOptions.initialValue = true;
    }

    const formItemLayout = section.span ? {
      labelCol: {
        span: section.span.label
      },
      wrapperCol: {
        span: section.span.input
      }
    } : {};

    return ( <Col span={ field.span || 24 } key={ `field_${ inx }` }>

      <FormItem
        { ...formItemLayout }
        label={ field.control !== CHECKBOX ? labelNode : "" }
        key={ `field${inx}` }>
        { getFieldDecorator( field.name, decoratorOptions )( this.renderControl( field ) ) }
        { field.description ? <Markdown
          md={ field.description }
          className="command-row-description" />    : "" }
        { field.control === FILE && <Button
          onClick={ ( e ) => this.onClickSelectFile( e, field ) }>Select file</Button>
        }
        { field.hasOwnProperty( "template" ) && <TemplateHelper
          field={ field }
          onChange={ this.onTemplateHelperChange }
          environments={ this.props.environments }
          variables={ this.props.variables }
          config={ field.template } /> }
      </FormItem>


    </Col> );
  };

  renderRow = ( row, inx, section ) => {
    validate( row, {
      description: "string=",
      fields: "array"
    });
    return ( <Row gutter={16} key={ `row_${ inx }` } className="ant-form-inline edit-command-inline">
      { row.description ? <Markdown
        md={ row.description }
        className="command-row-description" /> : "" }
      { row.fields.map( ( field, inx ) => this.renderField( field, inx, section ) ) }
    </Row> );
  };

  mapFieldsToRow = ( field ) => ({
    fields: [ field ]
  });


  renderSection = ( section, inx ) => {
    validate( section, {
      legend: "string=",
      tooltip: "string=",
      description: "string=",
      fields: "array=",
      rows: "array=",
      collapsed: "boolean=",
      span: "object=" // label: X, input: X
    });

    return (
      <fieldset className="command-form__fieldset" key={ `section_${ inx }` }>
        { !section.collapsed && <legend>
          <span>{ section.legend || "Parameters" }</span>
          { section.tooltip && <Tooltip title={ section.tooltip } icon="question-circle" /> }
        </legend> }
        { section.description &&
        <Markdown
          md={ section.description }
          className="command-section-description" />
        }

        { section.fields && section.fields
          .map( this.mapFieldsToRow )
          .map( ( row, inx ) => this.renderRow( row, inx, section ) ) }

        { section.rows && section.rows.map( ( row, inx ) => this.renderRow( row, inx, section ) ) }
      </fieldset> );
  }

  renderSectionWrapper = ( section, inx ) => {
    const header = ( <span>{ section.legend || "Advanced Options" }</span> );
    return section.collapsed
      ? ( <Collapse key={ `collapse_${ inx }` }
        expandIcon={({ isActive }) => ( <Icon
          type="right-circle" rotate={isActive ? 90 : 0} /> )}
      >
        <Panel key={ `panel_${ inx }` }

          header={ header } className="command-options-panel">
          { this.renderSection( section, inx ) }
        </Panel>
      </Collapse> )
      : this.renderSection( section, inx );
  }


  render() {
    const { schema } = this.props;
    return (
      <ErrorBoundary>
        { schema.params.map( this.renderSectionWrapper ) }
      </ErrorBoundary>
    );
  }
}