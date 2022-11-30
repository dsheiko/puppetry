import React from "react";
import AbstractComponent from "component/AbstractComponent";
import { Icon } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import { MODAL_DEFAULT_PROPS } from "constant";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import eventEmitter from "service/eventEmitter";
import { TargetTable } from "component/AppLayout/Main/TargetTable";
import { InstantModal } from "component/Global/InstantModal";
import classNames from "classnames";
import { EE_SHOW_EDIT_TARGETS_MODAL } from "constants";

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
    isVisible: false
  }  

  close() {
    this.setState({ isVisible: false });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  componentDidMount() {
    eventEmitter.on( EE_SHOW_EDIT_TARGETS_MODAL, () => {
        this.setState({ isVisible: true });
    });
  }


  render() {
    const { isVisible } = this.state;

    return <InstantModal          
          className={ classNames({
            "modal--instant-targets": true,
            "is-opaque": !isVisible
          }) }
          title="Edit Targets"
          visible={ isVisible }
          closable
          onCancel={ this.onClickCancel }
          footer={ null }
          extraBtns={ <a className="ant-modal-close" style={{ right: 32 }} href="#cTargetTableEditCsvBtn">
          <span className="ant-modal-close-x" style={{ pointerEvents: "none" }}><Icon type="arrow-down" /></span></a> }
          { ...MODAL_DEFAULT_PROPS }          
        >
          { isVisible ? <ErrorBoundary>
          <TargetTable />
        </ErrorBoundary> :  null }

        </InstantModal>;
  }
}

