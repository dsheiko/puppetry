import React from "react";
import PropTypes from "prop-types";
import If from "component/Global/If";
import ErrorBoundary from "component/ErrorBoundary";
import { Collapse, Form, Input, InputNumber, Checkbox, Row, Col, Select, Radio, Icon  } from "antd";
import { validate } from "bycontract";
import Tooltip from "component/Global/Tooltip";
import { FILE, TEXTAREA, RADIO_GROUP, INPUT, INPUT_NUMBER, CHECKBOX, SELECT,
  SEARCH_SELECT } from "component/Schema/constants";
import { ipcRenderer } from "electron";
import { E_BROWSE_FILE, E_FILE_SELECTED } from "constant";
import Markdown from "component/Global/Markdown";
import Link from "component/Global/Link";

const FormItem = Form.Item,
     { Option, OptGroup } = Select,
      RadioGroup = Radio.Group,
      Panel = Collapse.Panel,
      { TextArea } = Input,

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

    record: PropTypes.object.isRequired,
    schema: PropTypes.any
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
        return (<RadioGroup>
          {
            field.options.map( ( option, inx ) => {
              return typeof option === "string"
                ? ( <Radio key={inx} value={ option }>{ option }</Radio> )
                : ( <Radio key={inx} value={ option.value }>{ option.description }</Radio> );
            })
          }
        </RadioGroup>);
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


    return (<Col span={ field.span || 24 } key={ `field_${ inx }` }>

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
      </FormItem>

      { field.template && <div className="template-helper">
      <span><Icon type="arrow-up" /> Insert template <Link to="https://docs.puppetry.app/template">expressions</Link></span>
      <Select size="small">
        <OptGroup label="Variables">
          <Option key="1">FOO</Option>
          <Option key="1">BAR</Option>
        </OptGroup>
      </Select>
      </div> }

    </Col>);
  };

  renderRow = ( row, inx, section ) => {
    validate( row, {
      description: "string=",
      fields: "array"
    });
    return (<Row gutter={16} key={ `row_${ inx }` } className="ant-form-inline edit-command-inline">
      { row.description ? <Markdown
        md={ row.description }
        className="command-row-description" /> : "" }
      { row.fields.map( ( field, inx ) => this.renderField( field, inx, section ) ) }
    </Row>);
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
      rows: "array="
    });

    return (
      <fieldset className="command-form__fieldset" key={ `section_${ inx }` }>
      { !section.options && <legend>
        <span>{ section.legend || "Parameters" }</span>
        { section.tooltip && <Tooltip title={ section.tooltip } icon="question-circle" /> }
      </legend> }
      <If exp={ section.description }>
        <Markdown
        md={ section.description }
        className="command-section-description" />
      </If>

       { section.fields && section.fields
          .map( this.mapFieldsToRow )
          .map( ( row, inx ) => this.renderRow( row, inx, section ) ) }

      { section.rows && section.rows.map( ( row, inx ) => this.renderRow( row, inx, section ) ) }
      </fieldset> );
  }

  renderSectionWrapper = ( section, inx ) => {
    return section.options
      ? (<Collapse key={ `collapse_${ inx }` }>
          <Panel key={ `panel_${ inx }` } header={ section.legend || "Options" } className="command-options-panel">
            { this.renderSection( section, inx ) }
          </Panel>
        </Collapse>)
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
};