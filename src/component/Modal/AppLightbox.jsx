import React from "react";
import PropTypes from "prop-types";
import Carousel, { Modal, ModalGateway } from "react-images";
import ErrorBoundary from "component/ErrorBoundary";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.appLightbox,
        data: state.app.lightbox
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class AppLightbox extends React.Component {

  state = {
    photoIndex: 0
  };

  static propTypes = {
    action:  PropTypes.shape({
      setApp: PropTypes.func.isRequired
    }),
    isVisible: PropTypes.any.isRequired,
    data: PropTypes.object.isRequired
  }

  onClose = () => {
    this.props.action.setApp({ appLightbox: false });
  }

  // Do not update until visible
  shouldComponentUpdate( nextProps ) {
    if ( this.props.data !== nextProps.data ) {
      return true;
    }
    if ( this.props.isVisible !== nextProps.isVisible ) {
      return true;
    }
    if ( nextProps.isVisible === false ) {
      return false;
    }
    return true;
  }

  /**
   * Get index safely
   * @param {Object[]} data
   * @returns {Number}
   */
  getCurrentIndex( data ) {
    return data.index in data.images ? data.index : 0;
  }

  render() {
    const { isVisible, data } = this.props;

    return ( <ErrorBoundary>
      <ModalGateway>
        { isVisible !== false ? (
          <Modal onClose={ this.onClose }>
            <Carousel views={ data.images } currentIndex={ this.getCurrentIndex( data ) } />
          </Modal>
        ) : this.renderLoading  }
      </ModalGateway>
    </ErrorBoundary> );
  }
}