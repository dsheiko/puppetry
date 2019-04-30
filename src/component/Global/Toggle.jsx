import React from "react";
import PropTypes from "prop-types";

export default class Toggle extends React.Component {

    static propTypes = {
      children: PropTypes.any
    }

    state = {
      visible: false
    };

    onClick = () => {
      this.setState({ visible: !this.state.visible });
    }

    render() {
      // JavaScript is an eagearly evaluated language, so even if th exp
      const defer = () => this.props.children;
      return ( <div onClick={ this.onClick }>
        { this.state.visible && defer() }
      </div> );
    }
}