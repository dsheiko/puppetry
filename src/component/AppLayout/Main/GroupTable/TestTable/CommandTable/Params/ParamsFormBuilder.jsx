import React from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "component/ErrorBoundary";
import { Collapse, Button, Form, Input, InputNumber, Checkbox, Select, Radio, Icon  } from "antd";
import { validate } from "bycontract";
import Tooltip from "component/Global/Tooltip";
import { FILE, TEXTAREA, RADIO_GROUP, INPUT, INPUT_NUMBER, CHECKBOX, SELECT,
  TARGET_SELECT } from "component/Schema/constants";
import { ipcRenderer } from "electron";
import { E_BROWSE_FILE, E_FILE_SELECTED, FIELDSET_DEFAULT_LAYOUT, FIELDSET_DEFAULT_CHECKBOX_LAYOUT } from "constant";
import Markdown from "component/Global/Markdown";
import { TemplateHelper } from "./TemplateHelper";
import { connect } from "react-redux";
import { SELECT_SEARCH_PROPS } from "service/utils";

function result( obj, prop, record ) {
  if ( typeof obj[ prop ] === "function" ) {
    return obj[ prop ]( record );
  }
  return obj[ prop ];
}


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
            pos="up-left"
          />
        </span>
      ),

      mapStateToProps = ( state, props ) => {
        return {
          environments: state.project.environments,
          variables: state.project.variables,
          targets: props.schema.requiresTargets ? state.suite.targets : {}
        };
      },
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
    variables: PropTypes.any,
    targets: PropTypes.object
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
    const { setFieldsValue, getFieldValue } = this.props.form,
          prevValue = getFieldValue( name ) || "";
    setFieldsValue({
      [ name ]: prevValue + ( typeof val === "string" ? val : "" )
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
          { onSubmit, targets } = this.props,
          safeTargets = Object.values( targets ).filter( item => item.target ),
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
    case TARGET_SELECT:
      return ( <Select
        { ...SELECT_SEARCH_PROPS }
        mode="multiple"
        style={ inputStyle }
        placeholder={ field.placeholder }
        onChange={ onSelect }
      >
        {
          safeTargets.map( ( option, inx ) => ( <Option
            key={inx} value={ option.target }>{ option.target }</Option>
          ) )
        }
      </Select> );
    case SELECT:
      return ( <Select
        { ...SELECT_SEARCH_PROPS }
        style={ inputStyle }

        placeholder={ field.placeholder }
        onSelect={ ( value ) => {
          field.onChange && field.onChange( value, this.props.form );
          onSelect( value );
        }}
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
          pos="up-left"
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

  /**
   * Initial value is the one used when noe saved in the record
   * @param {Object} field
   * @returns {String}
   */
  getInitialValue( field ) {
    const { record } = this.props,
          key = field.name.replace( /^params\./, "" ),
          initialValue = ( ( record.params && record.params.hasOwnProperty( key ) )
            ? record.params[ key ]
            : result( field, "initialValue", "" )
          );

    return field.control === "CHECKBOX" ? Boolean( initialValue ) : initialValue;
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
      decoratorOptions.valuePropName = "checked";
      decoratorOptions.initialValue = initialValue;
    }

    const formItemLayout = section.span ? {
      labelCol: {
        span: section.span.label
      },
      wrapperCol: {
        span: section.span.input
      }
    } : ( field.control === CHECKBOX ? FIELDSET_DEFAULT_CHECKBOX_LAYOUT : FIELDSET_DEFAULT_LAYOUT );

    return (  <FormItem
      { ...formItemLayout }
      className="ant-form-item--layout"
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
    </FormItem>  );
  };

  renderRow = ( row, inx, section ) => {
    validate( row, {
      description: "string=",
      fields: "array"
    });
    return ( <div key={ inx } className="command-form__noncollapsed">
      { row.description ? <Markdown
        md={ row.description }
        className="command-row-description" /> : "" }
      { row.fields.map( ( field, inx ) => this.renderField( field, inx, section ) ) }
    </div> );
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
          <span>{ section.legend || "" }</span>
          { section.tooltip && <Tooltip title={ section.tooltip } icon="question-circle" pos="up-left" /> }
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
          type="right" rotate={isActive ? 90 : 0} /> )}
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