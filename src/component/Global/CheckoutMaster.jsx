import React from "react";
import AbstractComponent from "component/AbstractComponent";
import { ipcRenderer } from "electron";
import { truncate } from "service/utils";
import mediator from "service/mediator";
import { message, Button, Icon } from "antd";
import { E_CHECKOUT_MASTER_OPEN, E_CHECKOUT_MASTER_CLOSE } from "constant";

export class CheckoutMaster extends AbstractComponent {

  componentDidMount() {
    mediator.on( E_CHECKOUT_MASTER_OPEN, this.onOpen );
    mediator.on( E_CHECKOUT_MASTER_CLOSE, this.onClose );
  }

  onCheckoutResponse = () => {
    this.props.action.loadProject();
    this.hide && this.hide();
    message.info( "You are back on the master branch" );
  }

  hide = null;

  onClose = () => {
    this.hide && this.hide();
  }

  onOpen = ( comment ) => {
    this.hide = message.open({
      content: ( <React.Fragment>You are on &apos;detached&apos; version<br />
        { comment && <p><b>{ truncate( comment, 42 ) }</b></p> }
        <Button
          type="primary"
          onClick={ this.onCheckoutMaster }>
          Checkout master
        </Button>

      </React.Fragment> ),
      duration: 0,
      icon: ( <Icon type="api" /> )
    });
  }

  render() {
    return null;
  }
}
