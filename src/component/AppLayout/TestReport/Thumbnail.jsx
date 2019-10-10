import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { shell } from "electron";
import { notification } from "antd";

export class Thumbnail extends AbstractComponent {

  static propTypes = {
    item: PropTypes.object.isRequired,
    action: PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      setLightboxIndex: PropTypes.func.isRequired
    })
  }

  onClickImg = ( e, inx ) => {
    e.preventDefault();
    this.props.action.setLightboxIndex( inx );
    this.props.action.setApp({ appLightbox: true });
  }

  render() {
    const { item, onClickImg } = this.props;
    return <figure>
        <img
          onClick={ ( e ) => this.onClickImg( e, item.inx ) }
          src={ `${ item.src }?${ Date.now() }`  } className="screenshot-thumb"
          title={ item.caption }
          alt={ item.caption } />
        <span className="screenshot-thumb__caption">{ item.caption }</span>
        <a onClick={ ( e ) => this.download( item.src, e ) } className="screenshot-thumb__download">Download</a>
      </figure>;
  }

}
