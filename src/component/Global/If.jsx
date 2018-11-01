import React from "react";
import PropTypes from "prop-types";

export default class If extends React.Component {

    static propTypes = {
      exp: PropTypes.any,
      children: PropTypes.any
    }

    render() {
      // JavaScript is an eagearly evaluated language, so even if th exp
      const defer = () => this.props.children;
      return this.props.exp ? defer() : null;
    }
}