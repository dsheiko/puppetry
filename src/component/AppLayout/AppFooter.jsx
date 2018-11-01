import React from "react";
import { Layout, Row, Col, Icon } from "antd";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";

const { Footer } = Layout;

export class AppFooter extends AbstractComponent {

  render() {
    const today = new Date();

    return (
      <ErrorBoundary>
        <Footer>
          <Row type="flex" align="middle" justify="space-between">
            <Col className="text-align-left" span={18}>
                      &copy; { today.getFullYear() } MIT License. Created by
              { " " } <a href="http://dsheiko.com"
                onClick={ this.onExtClick }
                rel="noopener noreferrer"
                target="_blank">Dmitry Sheiko</a>
            </Col>
            <Col className="text-align-right" span={6}>
              <a onClick={ this.onExtClick }
                rel="noopener noreferrer"
                title="Find me on Amazon" className="layout-icon"
                href="https://www.amazon.com/default/e/B0788FN46T/" target="_blank"><Icon type="amazon" /></a>
              <a onClick={ this.onExtClick }
                rel="noopener noreferrer"
                title="Contact me on Twitter" className="layout-icon"
                href="https://twitter.com/sheiko" target="_blank"><Icon type="twitter" /></a>
              <a onClick={ this.onExtClick }
                rel="noopener noreferrer"
                title="Project on Github" className="layout-icon"
                href="https://github.com/dsheiko/puppetry" target="_blank"><Icon type="github" /></a>
              <a onClick={ this.onExtClick }
                rel="noopener noreferrer"
                title="Fork me"
                className="layout-icon" href="https://github.com/dsheiko/puppetry"
                target="_blank"><Icon type="fork" /></a>
            </Col>
          </Row>

        </Footer>
      </ErrorBoundary>
    );
  }
}