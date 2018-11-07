import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { getDemoProjectDirectory } from "service/io";

export class Welcome extends AbstractComponent {

  static propTypes = {
    action: PropTypes.shape({
      loadProject: PropTypes.func.isRequired,
      updateApp: PropTypes.func.isRequired
    }),
    projectDirectory: PropTypes.string.isRequired
  }

  onOpenDemoProject = async ( e ) => {
    const { loadProject } = this.props.action;
    e.preventDefault();
    await loadProject( getDemoProjectDirectory() );
  }

  onCreateProject = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ newProjectModal: true });
  }

  render() {
    return (
      <div className="welcome">
        <h1>Welcome!</h1>
        <p>You are using Puppetry, a tool to build End-To-End automation tests without coding.</p>

        <p>What you can do now is to open a
          { " " } <a href="#empty" onClick={ this.onOpenDemoProject }>demo project</a> or
          { " " } <a href="#empty" onClick={ this.onCreateProject }>create a new one</a>.</p>

        <p>E2E testing for the Web in a nutshell is about locating a target, applying a command
        on it, asserting the result complies the given constraints. Where target can be
        either a <a onClick={ this.onExtClick }
          href="https://en.wikipedia.org/wiki/HTML_element">HTML element</a> or the entire page.
        Commands for the page can be such as “goto to a URL”, “make a screenshot”. For an element - click,
        focus, type a text and so on. As for assertions we can check for example that element’s property
        or attribute has a specified value, or element’s position
        and size match the provided criteria.</p>

        <p>Puppetry offers you a UI to create and manage your E2E tests. Namely it allows:</p>
        <ul>
          <li>to declare element targets as pairs a arbitrary variable / CSS selector or Xpath.
Element can be easily located with Chrome DevTool.
          <a onClick={ this.onExtClick } href="https://www.youtube.com/watch?v=du2Jnm-TzJc">Then you
just right-click on it and copy selector or XPath</a>.</li>
          <li>to manage your test structure (suite, test group, test)</li>
          <li>to manage commands and assertions</li>
        </ul>

        <p>If you experience any problems with application, please, report to { " " }
          <a onClick={ this.onExtClick }
            href="https://github.com/dsheiko/puppetry/issues"
            rel="noopener noreferrer">github.com/dsheiko/puppetry/issues</a></p>
      </div>

    );
  }
}
