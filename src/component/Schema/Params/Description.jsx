import React from "react";
import AbstractComponent from "component/AbstractComponent";

export class Description extends AbstractComponent {
  render() {
    const { schema, target } = this.props;
    if ( !schema ) {
      return null;
    }
    const msg = schema.description.replace( `{target}`, target ),
          match = msg.match( /\[(.+)\]\(((.+))\)/ );
    if ( match ) {
      const [ divider, text, url ] = match,
            [ lhand, rhand ] = msg.split( divider );
      return ( <p className="command-description">
        { lhand } <a onClick={this.onExtClick} href={ url }>{ text }</a>
        { rhand }</p> );
    }
    return ( <p className="command-description">{ msg }</p> );
  }

}
