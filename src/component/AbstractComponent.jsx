import React from "react";
import PropTypes from "prop-types";
import { shell } from "electron";

export default class AbstractComponent extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      setLoadingFor: PropTypes.func
    })
  }

  onExtClick = ( e ) => {
    e.preventDefault();
    const el = e.target.tagName === "A" ? e.target : e.target.parentNode;
    shell.openExternal( el.href );
    this.props.action && this.props.action.setLoadingFor( 1000 );
  }

}