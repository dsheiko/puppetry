import React from "react";
import PropTypes from "prop-types";
import { Icon  } from "antd";

export default function Tooltip( props ) {
  if ( !props.title ) {
    return <React.Fragment>{ props.children }</React.Fragment>;
  }
  return ( <span className="char-pad--left"
    data-balloon={ props.title }
    data-balloon-length="xlarge"
    data-balloon-pos={ props.pos || "right" }>
    { props.icon ? ( <Icon type={ props.icon }  /> ) : props.children }
  </span> );
}

Tooltip.propTypes = {
  pos: PropTypes.string,
  title: PropTypes.any,
  icon: PropTypes.string.isRequired,
  children: PropTypes.any
};