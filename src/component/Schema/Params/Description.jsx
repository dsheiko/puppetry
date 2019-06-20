import React, { Fragment } from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import Markdown from "component/Global/Markdown";

export class Description extends AbstractComponent {

  static propTypes = {
    target: PropTypes.any,
    schema: PropTypes.any
  }

  render() {
    const { schema, target } = this.props;
    if ( !schema || !schema.description ) {
      return null;
    }
    return <Fragment>
      <Markdown
        md={ schema.description.replace( `{target}`, target ) }
        className="command-row-description" />
    </Fragment>;
  }

}
