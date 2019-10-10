import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";

export class TestSpecificationPane extends AbstractComponent {

  state = {
    runSpecTests: false
  }

  onChangeCheckbox = ( checked, field ) => {
    this.setState({
      [ field ]: checked
    });
  }

  render() {
    return (
      <ErrorBoundary>
      <p className="export-desc">
        By pressing &quot;Export&quot; Puppetry generates a text file with project contents
        in human-readable form
      </p>

      <div className="test-options">
            <Checkbox onChange={ e  => this.onChangeCheckbox( e.target.checked, "runSpecTests" ) } >
              run tests and generate step screenshots
            </Checkbox>
      </div>

      </ErrorBoundary>
    );
  }
}