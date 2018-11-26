import React from "react";
import PropTypes from "prop-types";
import { Icon  } from "antd";

export default function Tooltip( props ) {
  return ( <span className="char-pad--left"
    data-balloon={ props.title }
    data-balloon-length="xlarge"
    data-balloon-pos="right">
    { props.icon ? ( <Icon type={props.icon}  /> ) : props.children }
  </span> );
}

Tooltip.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.any
};