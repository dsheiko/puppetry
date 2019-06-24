import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import AbstractComponent from "component/AbstractComponent";
import { getDemoProjectDirectory } from "service/io";

export class Welcome extends AbstractComponent {

  static propTypes = {
    action: PropTypes.shape({
      loadProject: PropTypes.func.isRequired,
      setApp: PropTypes.func.isRequired
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
    this.props.action.setApp({ newProjectModal: true });
  }

  render() {
    return (
      <div className="welcome" id="cWelcome">
        <h1>Welcome!</h1>
        <p>You are using Puppetry, scriptless E2E test automation tool.</p>

        <p>What you can do now is to open a
          { " " } <Button id="cWelcomeDemoProjectBtn"
            onClick={ this.onOpenDemoProject }>demo project</Button> or
          { " " } <Button id="cWelcomeNewProjectBtn"
            onClick={ this.onCreateProject }>create a new one</Button>.</p>
        <br />
        <p>
        E2E testing for the Web in a nutshell is about locating a target, applying a browser method on it,
asserting the new page (DOM) state. Where target can be either a <a onClick={ this.onExtClick }
            href="https://en.wikipedia.org/wiki/HTML_element">HTML element</a> { " " }
            or the entire page. Page methods can be such as
            &quot;goto to a URL&quot;, &quot;make a screenshot&quot;.
For an element - <code>click</code>, <code>focus</code>, <code>type a text</code>
and so on. As for assertions we can check for example that element{"'"}s property
or attribute has a specified value, or element{"'"}s position and size match the provided criteria.
        </p>


        <p>Puppetry offers you an easy-to-use UI where you choose browser methods
        and assertions from a predefined list, with predefined settings, guided by extensive tips.
        Namely you can do the following:</p>
        <ul>
          <li>
          to declare element targets as pairs <code>variable = locator</code>, where locator can be either
          CSS selector or Xpath. When using Chrome DevTool
            { " " } <a onClick={ this.onExtClick } href="https://www.youtube.com/watch?v=du2Jnm-TzJc">you
          just right-click on a target element and copy selector or XPath</a>
          </li>
          <li>to manage your test structure ( project, suite, test cases, test steps )</li>
          <li>to manage browser methods and assertions</li>
        </ul>
        <br />
        <p>If you experience any problems with application, please, report to { " " }
          <a onClick={ this.onExtClick }
            href="https://github.com/dsheiko/puppetry/issues"
            rel="noopener noreferrer">github.com/dsheiko/puppetry/issues</a></p>
      </div>

    );
  }
}
