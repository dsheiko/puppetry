import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Icon, Alert, Select, Checkbox, Modal, Button, message } from "antd";
import { getSelectedVariables, getActiveEnvironment } from "selector/selectors";

const { Option } = Select;

export class SelectEnv extends AbstractComponent {

    static propTypes = {
      action: PropTypes.any,
      environment: PropTypes.string,
      environments: PropTypes.any
    }

    onEnvChange = ( activeEnv ) => {
      this.props.action.setApp({ environment: activeEnv });
    }

    render() {
      const { environments, environment } = this.props,
            activeEnv = getActiveEnvironment( environments, environment );

      return ( <div className="select-group-inline">
        <span className="select-group-inline__label">
          <Icon type="environment" title="Select a target environment" />
        </span>
        <Select
          showSearch
          style={{ width: 348 }}
          placeholder="Select a environment"
          optionFilterProp="children"
          onChange={ this.onEnvChange }
          defaultValue={ activeEnv }
          filterOption={( input, option ) =>
            option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
          }
        >
          { environments.map( env => ( <Option value={ env } key={ env }>
            { env }
          </Option> ) ) }
        </Select>
      </div> );
    }
}