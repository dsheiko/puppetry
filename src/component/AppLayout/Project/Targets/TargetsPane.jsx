import React from "react";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";
import { TargetTable } from "component/AppLayout/Main/TargetTable";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "action";
import * as selectors from "selector/selectors";

import LearnMore from "component/Global/LearnMore";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        environments: state.project.environments,
        selector: {
          getTargetDataTable: () => selectors.getTargetDataTable( state.project.targets )
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
        <p>Targets are identifiers associated with locators (CSS selector or XPath)
           that we can refer in the test cases. Shared targets are accessible in all suites of the open project.
        </p>

        <p><LearnMore href="https://docs.puppetry.app/target" />
        </p>
        <br />
        <TargetTable model="SharedTarget" action={ action } targets={ selector.getTargetDataTable() } />

      </ErrorBoundary>
    );
  }
}
