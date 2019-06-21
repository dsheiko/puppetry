import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import classNames from "classnames";

export class InstantModal extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onOk: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    footer: PropTypes.array.isRequired,
    className: PropTypes.string,
    children: PropTypes.any
  }

  state = {
    isVisible: true
  }

  onClose = () => {
    this.setState({ visible: false });
  }

  id = "undefined";
  static counter = 0;

  componentDidMount() {
    this.id = `instantDialog${ ++InstantModal.counter }`;
  }

  render() {
    const { title, visible, footer, onCancel, id, className } = this.props;

    return ( <div id={ id || "cInstantModal" } className={ classNames({
      "is-hidden": !visible,
      "modal--instant": true,
      [ className ]: true
    })
    }>
      <div className="ant-modal-mask" />
      <div tabIndex={-1} className="ant-modal-wrap " role="dialog" aria-labelledby={ this.id }>
        <div role="document" className="ant-modal">
          <div tabIndex={0} className="ant-modal-sentinel"></div>
          <div className="ant-modal-content">
            <button aria-label="Close" className="ant-modal-close" onClick={ onCancel }>
              <span className="ant-modal-close-x">
                <Icon type="close" />
              </span>
            </button>
            <div className="ant-modal-header">
              <div className="ant-modal-title" id={ this.id }>{ title }</div>
            </div>
            <div className="ant-modal-body">

              { this.props.children }

            </div>
            <div className="ant-modal-footer">
              { footer }
            </div>
          </div>
          <div tabIndex={0} className="ant-modal-sentinel"></div>
        </div>
      </div>
    </div> );
  }
}
