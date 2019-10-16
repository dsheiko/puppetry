import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Icon, Select  } from "antd";
import { getActiveEnvironment } from "selector/selectors";
import { SELECT_SEARCH_PROPS } from "service/utils";

const { Option } = Select;

export class SelectEnv extends AbstractComponent {

    static propTypes = {
      action: PropTypes.any,
      environment: PropTypes.string,
      environments: PropTypes.any,
      theme: PropTypes.string
    }

    onEnvChange = ( activeEnv ) => {
      this.props.action.setApp({ environment: activeEnv });
    }

    render() {
      const { environments, environment, theme } = this.props,
            activeEnv = getActiveEnvironment( environments, environment );

      return ( <div className="select-group-inline">
        { theme !== "test-reports" && ( <span className="select-group-inline__label">
          <Icon type="environment" title="Select a target environment" />
        </span> ) }
      { theme === "test-reports" && ( <span className="select-group-inline__label">
          Environment:
        </span> ) }
        <Select
          { ...SELECT_SEARCH_PROPS }
          style={{ width: ( theme === "test-reports" ? 282 : 348 ) }}
          placeholder="Select a environment"
          onChange={ this.onEnvChange }
          defaultValue={ activeEnv }
        >
          { environments.map( env => ( <Option value={ env } key={ env }>
            { env }
          </Option> ) ) }
        </Select>
      </div> );
    }
}