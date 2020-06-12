import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import { Icon, Menu, Dropdown } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import AbstractPureComponent from "component/AbstractPureComponent";
import { confirmUnsavedChanges } from "service/smalltalk";
import If from "component/Global/If";
import { truncate } from "service/utils";


export class Experiment extends AbstractPureComponent {
  render() {
    return (<div class="experiment">
      <header>

      <img src="./assets/puppetry.svg" alt="Puppetry" />
      <h1>Puppetry
        <span>ver.{ " " + remote.app.getVersion() }</span>
      </h1>
    
      <Menu  mode="horizontal">
        <Menu.SubMenu
              key="file"
              id="cMainMenuFile"
              title={<span><Icon type="file" /><span>File</span></span>}
            >
          <Menu.Item key="mail1">
            File
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="mail2">
          Settings
        </Menu.Item>
        <Menu.Item key="mail3">
          Run
        </Menu.Item>
  </Menu>
      </header>

      <aside>111</aside>
      <main>
      2222
      </main>
      <footer>footer</footer>
      </div>);
  }
}
