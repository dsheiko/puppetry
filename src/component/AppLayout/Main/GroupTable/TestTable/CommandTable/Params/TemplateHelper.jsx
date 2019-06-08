import React from "react";
import PropTypes from "prop-types";
import { Icon, Select } from "antd";
import Link from "component/Global/Link";
import { getSelectedVariables, getActiveEnvironment } from "selector/selectors";

const { Option, OptGroup } = Select;

export class TemplateHelper extends React.Component {

  state = {
    exp: "",
    activeEnv: ""
  }

  onExpChange = ( val ) => {
    this.setState({
      exp: val
    });
  }

  onEnvChange = ( val ) => {
    this.setState({
      activeEnv: val
    });
  }

  onVarChange = ( val ) => {
    this.props.onChange( this.props.field.name, `{{ ${ val } }}` );
  }

  onIterateChange = ( vals ) => {
    this.props.onChange( this.props.field.name, `{{ iterate( ${ JSON.stringify( vals ) } ) }}` );
  }

  render() {

   const { config, variables, environments } = this.props,
         { exp } = this.state,
         activeEnv = getActiveEnvironment( environments, this.state.activeEnv ),
         selStyle = { width: 160 },
         wrapStyle = { marginLeft: config.marginLeft || 0 };

   return ( <div className="template-helper" style={ wrapStyle }>
      <span><Icon type="arrow-up" /> Here you can use <Link to="https://docs.puppetry.app/template">template expressions</Link></span>

      <Select
        placeholder="Select expression"
        size="small" style={ selStyle } onChange={ this.onExpChange }>

          <Option key="1" value="variables">Variables</Option>
          <Option key="2" value="env">env()</Option>
          <Option key="3" value="counter">counter()</Option>
          <Option key="3" value="iterate">iterate()</Option>
      </Select>

      { exp === "variables" && <Select
        placeholder="Select environment"
        size="small" style={ selStyle } onChange={ this.onEnvChange }>
        { environments.map(( key ) => (
          <Option key={ key } value={ key }>{ key }</Option>))}
      </Select> }

      { exp === "variables" && this.state.activeEnv && <Select
      placeholder="Select variable"
      size="small" style={ selStyle } onChange={ this.onVarChange }>
        { Object.keys( getSelectedVariables( variables, activeEnv ) ).map(( key ) => (
          <Option key={ key } value={ key }>{ key }</Option>))}
      </Select> }

      { exp === "iterate" && <Select
        placeholder="Enter values"
        mode="tags" tokenSeparators={[',']}
        size="small" onChange={ this.onIterateChange }>

      </Select> }

      </div> );
 }

}