import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
// going with require as "markdown-it" has no default export, and unit-tests do not support import * as alias
const MarkdownIt = require( "markdown-it" );

const parser = new MarkdownIt();

export default class Markdown extends AbstractComponent {

  static propTypes = {
    md: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  constructor( props ) {
    super( props );
    this.el = React.createRef();
  }

  componentDidMount() {
    Array.from( this.el.current.querySelectorAll( "a" ) ).forEach( el => {
      el.addEventListener( "click", this.onExtClick, false );
    });
  }

  componentWillUnmount() {
    Array.from( this.el.current.querySelectorAll( "a" ) ).forEach( el => {
      el.removeEventListener( "click", this.onExtClick );
    });
  }

  render() {
    const { md, className } = this.props,
          html = md ? parser.render( md ) : "";
    return (<div
      ref={ this.el }
      className={ `markdown ${ className }` }
      dangerouslySetInnerHTML={{ __html: html }}></div>);
  }

};
