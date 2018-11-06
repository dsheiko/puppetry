import log from "electron-log";
import React from "react";
import PropTypes from "prop-types";
import { shell } from "electron";
import { Icon } from "antd";

export default class ErrorBoundary extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      setLoadingFor: PropTypes.func.isRequired
    }),
    children: PropTypes.any.isRequired
  }

  constructor( props ) {
    super( props );
    this.state = { hasError: false };
  }

  onExtClick = ( e ) => {
    e.preventDefault();
    const el = e.target,
          { setLoadingFor }  = this.props.action;
    shell.openExternal( el.href );
    setLoadingFor( 1000 );
  }

  componentDidCatch( error ) {
    log.warn( `Renderer process:ErrorBoundary: ${ error }` );
    console.warn( error );
    // Display fallback UI
    this.setState({ hasError: true });
  }

  render() {
    if ( this.state.hasError ) {
      // You can render any custom fallback UI
      return ( <div className="critical-error">
        <h2><Icon type="frown-o" /></h2>
        <h1>Opps! Something went wrong.</h1>
        <p>Please report the issue on { " " }
          <a onClick={ this.onExtClick } href="https://github.com/dsheiko/puppetry/issues">GitHub</a>.</p>
      </div> );
    }
    return this.props.children;
  }
}
