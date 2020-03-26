import React from "react";
import PropTypes from "prop-types";
import { Tooltip as AntdTooltip  } from "antd";
import { ExclamationCircleOutlined, QuestionCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";

function renderIcon( icon ) {
  switch ( icon ) {
  case "exclamation-circle":
    return <ExclamationCircleOutlined />;
  case "question-circle":
    return <QuestionCircleOutlined />;
  case "info-circle":
    return <InfoCircleOutlined />;
  default:
    return null;
  }

}

export default function Tooltip( props ) {
  if ( !props.title ) {
    return <React.Fragment>{ props.children }</React.Fragment>;
  }

  return ( <AntdTooltip className="char-pad--left" title={ props.title }>{
    props.icon ? renderIcon( props.icon ) : props.children
  }</AntdTooltip> );
}

Tooltip.propTypes = {
  pos: PropTypes.string,
  title: PropTypes.any,
  icon: PropTypes.string,
  children: PropTypes.any
};