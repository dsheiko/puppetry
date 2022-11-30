import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import { Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { shell, remote } from "electron";
import { getLogPath } from "service/io";
import * as classes from "./classes";
import { MODAL_DEFAULT_PROPS } from "constant";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import eventEmitter from "service/eventEmitter";
import { TargetTable } from "component/AppLayout/Main/TargetTable";
import { InstantModal } from "component/Global/InstantModal";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.alert.visible,
        alert: state.app.alert
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class EditTargetsModal extends AbstractComponent {

  state = {
    isVisible: false,
    isRendered: false
  }  

  close() {
    this.setState({ isVisible: false });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  componentDidMount() {
    eventEmitter.on( "showEditTargetsModal", () => {
        this.setState({ isVisible: true, isRendered: true });
    });
  }


  render() {
    const { isVisible, isRendered } = this.state;

    return <InstantModal
          className="modal--instant-targets"
          title="Edit Targets"
          visible={ isVisible }
          closable
          onCancel={ this.onClickCancel }
          footer={ null }
          extraBtns={ <a className="ant-modal-close" style={{ right: 32 }} href="#cTargetTableEditCsvBtn">
          <span className="ant-modal-close-x" style={{ pointerEvents: "none" }}><Icon type="arrow-down" /></span></a> }
          { ...MODAL_DEFAULT_PROPS }          
        >
          { isRendered ? <ErrorBoundary>
          <TargetTable />
        </ErrorBoundary> :  this.renderLoading }

        </InstantModal>;
  }
}

