import log from "electron-log";
import React from "react";
import PropTypes from "prop-types";
import { shell, remote } from "electron";
import { Icon } from "antd";
import { getLogPath } from "service/io";

export default class ErrorBoundary extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      setLoadingFor: PropTypes.func.isRequired
    }),
    className: PropTypes.string,
    children: PropTypes.any
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

  onOpenLog = ( e ) => {
    e.preventDefault();
    shell.openPath( getLogPath() );
    this.props.action.setLoadingFor( 500 );
  }

  onReload = ( e ) => {
    e.preventDefault();
    remote.getCurrentWindow().reload();
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
      return ( <div className={ "critical-error " + ( this.props.className || "" ) }>
        <h2><Icon type="frown-o" /></h2>
        <h1>Something went wrong.</h1>
        <p>Report this on { " " }
          <a onClick={ this.onExtClick } href="https://github.com/dsheiko/puppetry/issues">GitHub</a>.
          Attaching the { " " }<a href="#errorlog" onClick={ this.onOpenLog }>error log</a>{ " " } helps.
        </p>
        <p>As a temporary fix, try to { " " }<a href="#reload" onClick={ this.onReload }>reload</a>{ " " } the page.</p>
      </div> );
    }
    return this.props.children;
  }
}
