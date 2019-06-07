import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";

export default class Link extends AbstractComponent {

    static propTypes = {
      to: PropTypes.string.isRequired,
      children: PropTypes.any
    }

    render() {
      const { to, children, title } = this.props;
      return <a onClick={ this.onExtClick }
        href={ to }
        title={ title || "" }
        rel="noopener noreferrer">{ children }</a>;
    }
}