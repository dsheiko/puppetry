import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";
import actions from "action";
import * as selectors from "selector/selectors";
import { TestTable } from "./TestTable";

const mapStateToProps = ( state ) => ({
        store: state,
        selector: {
          getTestDataTable: () => selectors.getStructureDataTable( state.snippets, "ctest" )
        }
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });


@connect( mapStateToProps, mapDispatchToProps )
export class SnippetsPane extends AbstractComponent {

  render() {
    const { store, action, selector } = this.props,
          tests = selector.getTestDataTable(),
          targets = Object.values( store.suite.targets );
    return (
      <ErrorBoundary>
        <TestTable
      expanded={ store.project.snippets }
      targets={ targets }
      tests={ tests }
      groupId={ "snippets" }
      selector={ this.props.selector }
      action={ this.props.action } />
      </ErrorBoundary>
    );
  }
}
