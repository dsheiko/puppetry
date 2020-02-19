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
              <span className="footer__copyright">
                <span>&copy; { today.getFullYear() } MIT License. Created by
                  { " " } <a href="http://dsheiko.com"
                    onClick={ this.onExtClick }
                    rel="noopener noreferrer"
                    target="_blank">Dmitry Sheiko</a>.
                </span>
                <span className="legal-links"><a href="https://puppetry.app/privacy/"
                  onClick={ this.onExtClick }
                  rel="noopener noreferrer"
                  target="_blank">privacy policy</a>
                </span>
              </span>
            </Col>
            <Col className="text-align-right" span={6}>
              <a onClick={ this.onExtClick }
                rel="noopener noreferrer"
                title="Find the author on Amazon" className="layout-icon"
                href="https://www.amazon.com/default/e/B0788FN46T/" target="_blank"><Icon type="amazon" /></a>

              <a onClick={ this.onExtClick }
                rel="noopener noreferrer"
                title="Find the author on Twitter" className="layout-icon"
                href="https://twitter.com/sheiko" target="_blank"><Icon type="twitter" /></a>

              <a onClick={ this.onExtClick }
                rel="noopener noreferrer"
                title="Find Puppetry on Facebook" className="layout-icon"
                href="https://www.facebook.com/puppetry.testing" target="_blank"><Icon type="facebook" /></a>


              <a onClick={ this.onExtClick }
                rel="noopener noreferrer"
                title="Join Puppetry channel on Slack" className="layout-icon"
                href="https://puppetry-app.slack.com" target="_blank"><Icon type="slack" /></a>

              <a onClick={ this.onExtClick }
                rel="noopener noreferrer"
                title="Find Puppetry on Github" className="layout-icon"
                href="https://github.com/dsheiko/puppetry" target="_blank"><Icon type="github" /></a>

            </Col>
          </Row>

        </Footer>
      </ErrorBoundary>
    );
  }
}