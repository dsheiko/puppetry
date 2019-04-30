import React from "react";
import PropTypes from "prop-types";
import { Icon, Menu, Dropdown } from "antd";


class RowDropdownOverlay extends React.Component {

  apply = ( action, record ) => {
    this.props[ action ]( record );
    this.props.close();
  }

  render() {
    const { close, record, validClipboard, isNotTargetTable,
            toggleEnable, insertRecord, cloneRecord, copyClipboard, pasteClipboard } = this.props,
          isValidClipboard = validClipboard();

    return (
      <Menu>
        { isNotTargetTable && <Menu.Item key="enable">
          <a role="menuitem" tabIndex={0}  onClick={ () => this.apply( "toggleEnable", record ) }>
            { record.disabled ? "Enable" : "Disable" }
          </a>
        </Menu.Item> }
        <Menu.Item key="insert">
          <a role="menuitem" tabIndex={0}  onClick={ () => this.apply( "insertRecord", record ) }>Insert</a>
        </Menu.Item>
        <Menu.Item key="clone">
          <a role="menuitem" tabIndex={0}  onClick={ () => this.apply( "cloneRecord", record ) }>Clone</a>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item key="copy">
          <a role="menuitem" tabIndex={0}  onClick={ () => this.apply( "copyClipboard", record ) }>Copy</a>
        </Menu.Item>

        <Menu.Item key="paste" disabled={ !isValidClipboard }>
          <a role="menuitem" tabIndex={0}
            onClick={ () => this.apply( "pasteClipboard", record ) }>Paste</a>
        </Menu.Item>

      </Menu>
    );
  }
}



export class RowDropdown extends React.Component {

  state = {
    visible: false
  }

  getDropdownMenu( record ) {
    return (
      <RowDropdownOverlay { ...this.props } close={ this.close } />
    );
  }

  close = () => {
    this.setState({ visible: false });
  }

  onVisibleChange = ( visible ) => {
    this.setState({ visible });
  }

  render() {
    return ( <Dropdown overlay={ this.getDropdownMenu( this.props.record ) }
      visible={ this.state.visible }
      onVisibleChange={ this.onVisibleChange }
      placement="bottomRight"
      >
      <a className="ant-dropdown-link" href="#">
        <Icon type="more" />
      </a>
    </Dropdown> );
  }
}