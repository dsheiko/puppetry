import React from "react";
import PropTypes from "prop-types";
import { Icon, Tooltip as AntdTooltip  } from "antd";

export default function Tooltip( props ) {
  if ( !props.title ) {
    return <React.Fragment>{ props.children }</React.Fragment>;
  }

  return (<AntdTooltip className="char-pad--left" title={ props.title }>{
    props.icon ? ( <Icon type={ props.icon }  /> ) : props.children
  }</AntdTooltip>);
}

Tooltip.propTypes = {
  pos: PropTypes.string,
  title: PropTypes.any,
  icon: PropTypes.string,
  children: PropTypes.any
};