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
  }

  render() {
     const { project, selector } = this.props,
           [ firstEnv ] = project.environments,
           activeEnv = this.state.activeEnv || firstEnv,
           variables = selector.getVariableDataTable( firstEnv );
      
    return (
      <ErrorBoundary>

        Environment: { " " } <Select
            showSearch
            style={{ width: 200 }}
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
          </Select> { " " }<a tabIndex={-3} role="button"
            onClick={ this.onEditEnv } title="Edit list of available environments"><Icon type="tool" /></a>

          <VariableTable variables={ variables }
            env={ activeEnv }
            action={ this.props.action } />

      </ErrorBoundary>
    );
  }
}
