import React from "react";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";
import { TargetTable } from "component/AppLayout/Main/TargetTable";
import { Select, Icon } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "action";
import * as selectors from "selector/selectors";
import { INLINE_INPUT_STYLES } from "constant";
import LearnMore from "component/Global/LearnMore";
import { SELECT_SEARCH_PROPS } from "service/utils";

const { Option } = Select,

      // Mapping state to the props
      mapStateToProps = ( state ) => ({
        environments: state.project.environments,
        selector: {
          getTargetDataTable: () => selectors.getTargetDataTable( state.suite.targets )
        }
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });


@connect( mapStateToProps, mapDispatchToProps )
export class TargetsPane extends AbstractComponent {

  render() {
    const { action, selector } = this.props;

    return (
      <ErrorBoundary>
        <p>
    Here we can define a set of environment dependent variables. For an instance, we can declare a separate
    target app URL for every environment (test.acme.com, stage.acme.com, www.acme.com).
    Before running/exporting test project we specify the desired environment and the corresponding template
    tags in test cases will be replaced with the value (URL) given for that environment.
        </p>
        <p><LearnMore href="https://docs.puppetry.app/template" /></p>
        <br />
       <TargetTable model="SharedTarget" action={ action } targets={ selector.getTargetDataTable() } />

      </ErrorBoundary>
    );
  }
}
