import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";
import { VariableTable } from "./VariableTable";
import { Select, Icon } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "action";
import * as selectors from "selector/selectors";
import { INLINE_INPUT_STYLES } from "constant";
import LearnMore from "component/Global/LearnMore";

const { Option } = Select,

      // Mapping state to the props
      mapStateToProps = ( state ) => ({
        project: state.project,
        selector: {
          getVariableDataTable: ( env ) => selectors.getVariableDataTable( state.project.variables, env )
        }
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });


@connect( mapStateToProps, mapDispatchToProps )
export class VariablesPane extends AbstractComponent {

  state = {
    activeEnv: ""
  }

  onEnvChange = ( activeEnv ) => {
    this.setState({ activeEnv });
  }

  onEditEnv = ( e ) => {
    e.preventDefault();
    this.props.action.setApp({ editEnvironmentsModal: true });
  }

  render() {
     const { project, selector } = this.props,
           [ firstEnv ] = project.environments,
           activeEnv = selectors.getActiveEnvironment( project.environments, this.state.activeEnv ),
           variables = selector.getVariableDataTable( activeEnv );

    return (
      <ErrorBoundary>
    <p>
    Here we can define a set of environment dependent variables. For an instance, we can declare a separate target app URL for every environment (test.acme.com, stage.acme.com, www.acme.com). Before running/exporting test project we specify the desired environment and the corresponding template tags in test cases will be replaced with the value (URL) given for that environment.
    </p>
    <p><LearnMore href="https://docs.puppetry.app/template" /></p>
    <br />
        <div className="select-group-inline">
          <span className="select-group-inline__label">
          <Icon type="environment" title="Select a target environment" />
          </span>
          <Select
              showSearch
              style={ INLINE_INPUT_STYLES }
              placeholder="Select a environment"
              optionFilterProp="children"
              onChange={ this.onEnvChange }
              defaultValue={ activeEnv }
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
            { project.environments.map( env => (<Option value={ env } key={ env }>
              { env }
              </Option>)) }
            </Select>
            <a tabIndex={-3} role="button"
              onClick={ this.onEditEnv } title="Edit list of available environments">Edit</a>
        </div>

          <VariableTable variables={ variables }
            env={ activeEnv }
            action={ this.props.action } />

      </ErrorBoundary>
    );
  }
}
