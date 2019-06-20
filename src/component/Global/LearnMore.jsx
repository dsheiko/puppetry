import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";

export default class LearnMore extends AbstractComponent {

    static propTypes = {
      href: PropTypes.string.isRequired
    }

    render() {
      const { href } = this.props;
      return <a className="learn-more" href={ href } onClick={ this.onExtClick }>Learn more ➜</a>;
    }
}