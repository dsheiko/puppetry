import React from "react";
import EventEmitter from "events";
import AbstractComponent from "component/AbstractComponent";
import { ipcRenderer } from "electron";
import { truncate } from "service/utils";
import mediator from "service/mediator";
import { message, Button, Icon } from "antd";
import { E_CHECKOUT_MASTER_OPEN, E_CHECKOUT_MASTER_CLOSE, E_GIT_CHECKOUT_M, E_GIT_CHECKOUT_M_RESPONSE } from "constant";

export class CheckoutMaster extends AbstractComponent {

  componentDidMount() {
    mediator.on( E_CHECKOUT_MASTER_OPEN, this.onOpen );
    mediator.on( E_CHECKOUT_MASTER_CLOSE, this.onClose );
    ipcRenderer.removeAllListeners( E_GIT_CHECKOUT_M_RESPONSE );
    ipcRenderer.on( E_GIT_CHECKOUT_M_RESPONSE, this.onCheckoutResponse );
  }

  onCheckoutResponse = () => {
    this.props.action.loadProject();
    this.props.action.updateApp({ gitDetachedHeadState: false });
    this.hide && this.hide();
    message.info( "You are back on the master branch" );
  }

  hide = null;

  onClose = () => {
    this.hide && this.hide();
  }

  onCheckoutMaster = () => {
    ipcRenderer.send( E_GIT_CHECKOUT_M, this.props.projectDirectory );
  }

  onOpen = ( comment ) => {
    this.hide = message.open({
      content: (<React.Fragment>You are on 'detached' version<br />
        { comment && <p><b>{ truncate( comment, 42 ) }</b></p> }
        <Button
          type="primary"
          onClick={ this.onCheckoutMaster }>
          Checkout master
          </Button>

      </React.Fragment>),
      duration: 0,
      icon: (<Icon type="api" />)
    });
  }

  render() {
    return null;
  }
}
