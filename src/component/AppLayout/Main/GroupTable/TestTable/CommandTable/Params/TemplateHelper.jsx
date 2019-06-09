import React from "react";
import PropTypes from "prop-types";
import { Icon, Select, Button, Input } from "antd";
import Link from "component/Global/Link";
import faker from "faker";
import { FAKER_METHODS, FAKER_LOCALES } from "./constants";
import { getSelectedVariables, getActiveEnvironment } from "selector/selectors";

const { Option, OptGroup } = Select;

export class TemplateHelper extends React.Component {

  state = {
    exp: "",
    activeEnv: "",
    envName: "",
    fakerMethod: "",
    iterateList: [],
    randomList: []
  }

  reset() {
    this.setState({
      exp: "",
      activeEnv: "",
      envName: "",
      fakerMethod: "",
      iterateList: [],
      randomList: []
    });
  }

  onExpChange = ( val ) => {
    this.setState({ exp: val });
  }

  onEnvChange = ( val ) => {
    this.setState({ activeEnv: val });
  }

  onEnvNameChange = ( e ) => {
    this.setState({ envName: e.target.value });
  }

  onFakerMethodChange = ( val ) => {
    this.setState({ fakerMethod: val });
  }

  onVarChange = ( val ) => {
    this.props.onChange( this.props.field.name, `{{ ${ val } }}` );
    this.reset();
  }

  onIterateChange = ( vals ) => {
    this.setState({ iterateList: vals });
  }

  onIterateClick = ( vals ) => {
    this.props.onChange( this.props.field.name,
      `{{ iterate( ${ JSON.stringify( this.state.iterateList ) } ) }}` );
    this.reset();
  }

  onCounterClick = ( vals ) => {
    this.props.onChange( this.props.field.name,
      `{{ counter() }}` );
    this.reset();
  }

  onRandomChange = ( vals ) => {
    this.setState({ randomList: vals });
  }

  onRandomClick = ( vals ) => {
    this.props.onChange( this.props.field.name,
      `{{ random( ${ JSON.stringify( this.state.randomList ) } ) }}` );
    this.reset();
  }

  onEnvClick = () => {
    this.props.onChange( this.props.field.name,
      `{{ env( ${ JSON.stringify( this.state.envName ) } ) }}` );
    this.reset();
  }

  onFakerClick = ( val ) => {
    this.props.onChange( this.props.field.name,
      `{{ faker( ${ JSON.stringify( this.state.fakerMethod ) }, `
      + `${ JSON.stringify( val ) } ) }}` );
    this.reset();
  }

  render() {

   const { config, variables, environments } = this.props,
         { exp, iterateList, randomList, envName, fakerMethod } = this.state,
         activeEnv = getActiveEnvironment( environments, this.state.activeEnv ),
         selStyle = { width: 160 };

   return ( <div className="template-helper" >
      <span><Icon type="arrow-up" /> Here you can use <Link to="https://docs.puppetry.app/template">template expressions</Link></span>

      <Select
        placeholder="Select expression"
        value={ exp }
        size="small" style={ selStyle } onChange={ this.onExpChange }>

          <Option key="1" value="variables">Variables</Option>
          <Option key="2" value="env">env()</Option>
          <Option key="3" value="counter">counter()</Option>
          <Option key="4" value="iterate">iterate()</Option>
          <Option key="5" value="random">random()</Option>
          <Option key="6" value="faker">faker()</Option>
      </Select>

      { exp === "variables" && <Select
        placeholder="Select environment"
        size="small" style={ selStyle } onChange={ this.onEnvChange }>
        { environments.map(( key ) => (
          <Option key={ key } value={ key }>{ key }</Option>))}
      </Select> }

      { ( exp === "variables" && this.state.activeEnv ) ? <Select
      placeholder="Select variable"
      size="small" style={ selStyle } onChange={ this.onVarChange }>
        { Object.keys( getSelectedVariables( variables, activeEnv ) ).map(( key ) => (
          <Option key={ key } value={ key }>{ key }</Option>))}
      </Select> : null }

      { exp === "iterate" && <Select
        placeholder="Enter values"
        mode="tags" tokenSeparators={[ "," ]}
        size="small" onChange={ this.onIterateChange }>
      </Select> }

      { ( exp === "iterate" && iterateList.length ) ? <Button
        size="small"
        onClick={ this.onIterateClick }>Insert</Button> : null }

      { exp === "counter" && <Button
        size="small"
        onClick={ this.onCounterClick }>Insert</Button> }

      { exp === "random" && <Select
        placeholder="Enter values"
        mode="tags" tokenSeparators={[ "," ]}
        size="small" onChange={ this.onRandomChange }>
      </Select> }

      { ( exp === "random" && randomList.length ) ? <Button
        size="small"
        onClick={ this.onRandomClick }>Insert</Button> : null }

      { exp === "env" && <Input
        placeholder="Enter name"
        size="small" onChange={ this.onEnvNameChange } /> }

      { ( exp === "env" && envName ) ? <Button
        size="small"
        onClick={ this.onEnvClick }>Insert</Button> : null }

      { exp === "faker" && <Select
        placeholder="Select method"
        size="small" style={ selStyle } onChange={ this.onFakerMethodChange }>
        { Object.entries( FAKER_METHODS ).map(([ label, options ]) => (
          <OptGroup label={ label } key={ label }>
          { options.map( ( desc, inx ) => (<Option
          key={ inx } value={ `${ label }.${ desc }` }>{ desc }</Option>)) }
          </OptGroup>
          ))}
      </Select> }

      { ( exp === "faker" && fakerMethod ) ? <Select
        placeholder="Select locale"
        size="small" style={ selStyle } onChange={ this.onFakerClick }>
        { FAKER_LOCALES.map(( key ) => (
          <Option key={ key } value={ key }>{ key }</Option>))}
      </Select> : null }


      </div> );
 }

}