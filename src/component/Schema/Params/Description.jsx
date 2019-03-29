import React, { Fragment } from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";

export class Description extends AbstractComponent {

  static propTypes = {
    target: PropTypes.any,
    schema: PropTypes.any
  }

  renderLine = ( description, inx, target ) => {
    const msg = description.replace( `{target}`, target ),
          match = msg.match( /\[(.+)\]\(((.+))\)/ );
    if ( match ) {
      const [ divider, text, url ] = match,
            [ lhand, rhand ] = msg.split( divider );
      return ( <p className="command-description" key={ inx }>
        { lhand } <a onClick={this.onExtClick} href={ url }>{ text }</a>
        { rhand }</p> );
    }
    return ( <p className="command-description" key={ inx }>{ msg }</p> );
  }

  render() {
    const { schema, target } = this.props;
    if ( !schema ) {
      return null;
    }
    const descriptions = Array.isArray( schema.description ) ? schema.description : [ schema.description ];
    return <Fragment>{
      descriptions.map( ( description, inx ) => this.renderLine( description, inx, target ) )
    }</Fragment>;
  }

}
