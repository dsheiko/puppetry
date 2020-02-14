import React from "react";
import AbstractComponent from "component/AbstractComponent";
import StateStorage from "service/StateStorage";


export default class AbstractPersistentState extends AbstractComponent {

  constructor( props ) {
    super( props );
    this.assignStorage();
  }

  save() {
    this.storage.set( this.state );
  }

  assignStorage() {
    this.storage = new StateStorage( this.constructor.name );
  }

  componentDidMount() {
    this.setState( this.storage.get() );
  }

}