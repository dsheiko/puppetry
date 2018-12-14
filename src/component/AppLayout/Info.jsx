import React from "react";
import PropTypes from "prop-types";
import { Button, Row, Col, Input } from "antd";
import AbstractComponent from "component/AbstractComponent";
import { getDemoProjectDirectory } from "service/io";


export class Info extends AbstractComponent {

  static propTypes = {
    action: PropTypes.shape({
      updateApp: PropTypes.func.isRequired
    })
  }

  onOpenDemoProject = async ( e ) => {
    const { loadProject } = this.props.action;
    e.preventDefault();
    await loadProject( getDemoProjectDirectory() );
  }

  onCreate = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ newSuiteModal: true });
  }

  onOpen = ( e ) => {
    e.preventDefault();
    this.props.action.updateApp({ openSuiteModal: true });
  }


  render() {
    const { store } = this.props;
    return (
      <div className="welcome info" id="cInfo">

        <Row gutter="16">
          <Col span="2">
                Project
          </Col>
          <Col span="22">
            <Input disabled value={ store.project.name } />
          </Col>
        </Row>

        <Row>
          <Col span="2">
                Location
          </Col>
          <Col span="22">
            <Input disabled value={ store.settings.projectDirectory } />
          </Col>
        </Row>


        <p>You have opened a project. Now you can
          { " " } <Button id="cInfoCreateBtn"
            onClick={ this.onCreate }>create</Button> or
          { " " } <Button id="cInfoOpenBtn"
            onClick={ this.onOpen }>open</Button>
          { " " } a test suite file.</p><p>Besides, your can still open the { " " } <Button id="cInfoDemoProjectBtn"
          onClick={ this.onOpenDemoProject }>demo project</Button> </p>
        <br />
        <p>While on that subject, let’s brush up on Puppetry structure:</p>
        <ul>
          <li><strong>Test</strong> – is a test case that is intended to verify that web application
        complies with the specified requirements.
        Basically tests are about sending commands to the browser and asserting the responds.</li>
          <li><strong>Suite</strong> - is a collection of logically related tests (<code>.json</code> files)</li>
          <li><strong>Project</strong> – is a group of related test suites (a directory with suite files)</li>
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
