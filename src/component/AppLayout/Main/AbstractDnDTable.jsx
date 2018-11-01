import React from "react";
import PropTypes from "prop-types";
import { DragableRow } from "./DragableRow";

export default class AbstractDnDTable extends React.Component {

  static propTypes = {
    action:  PropTypes.shape({
      swapTest: PropTypes.func,
      swapGroup: PropTypes.func,
      swapCommand: PropTypes.func
    }),

    groupId: PropTypes.string.isRequired,
    testId: PropTypes.string.isRequired
  }

 components = {
   body: {
     row: DragableRow
   }
 };

  onRow = ( record, index ) => ({
    index,
    moveRow: this.moveRow
  });

  /**
   * Extending for pareants
   */
  extendActionOptions( options ) {
    if ( this.props.hasOwnProperty( "groupId" ) ){
      options.groupId = this.props.groupId;
    }
    if ( this.props.hasOwnProperty( "testId" ) ){
      options.testId = this.props.testId;
    }
    return options;
  }

  moveRow = ( dragIndex, hoverIndex, dragId, hoverId ) => {
    const update = this.props.action[ `swap${this.model}` ];
    update( this.extendActionOptions({
      sourceInx: dragIndex,
      targetInx: hoverIndex,
      sourceId: dragId,
      targetId: hoverId
    }) );
  };

}
