import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";

export class Thumbnail extends AbstractComponent {

  static propTypes = {
    item: PropTypes.object.isRequired,
    onClickImg: PropTypes.func.isRequired
  }

  render() {
    const { item, onClickImg } = this.props;
    return <figure>
        <img
          onClick={ ( e ) => onClickImg( e, item.inx ) }
          src={ item.src } className="screenshot-thumb"
          title={ item.title }
          alt={ item.title } />
        <span className="screenshot-thumb__title">{ item.title }</span>
      </figure>;
  }

}
