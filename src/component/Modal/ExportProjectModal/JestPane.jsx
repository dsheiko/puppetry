import React from "react";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractComponent from "component/AbstractComponent";

export class JestPane extends AbstractComponent {

  render() {
    return (
      <ErrorBoundary>
        <p className="export-desc">
            As you press &quot;Export&quot; Puppetry generates a
          { " " }<a onClick={ this.onExtClick } href="https://jestjs.io/">Jest project</a>{ " " }
             in the provided location.
            You just need to navigate into the directory,
            install dependencies (<code>npm install</code>) and run the tests (<code>npm test</code>).
        </p>
      </ErrorBoundary>
    );
  }
}