import React from "react";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

function dragDirection( dragIndex, hoverIndex, initialClientOffset, clientOffset, sourceClientOffset ) {
  const hoverMiddleY = ( initialClientOffset.y - sourceClientOffset.y ) / 2,
        hoverClientY = clientOffset.y - sourceClientOffset.y;

  if ( dragIndex < hoverIndex && hoverClientY > hoverMiddleY ) {
    return "downward";
  }
  if ( dragIndex > hoverIndex && hoverClientY < hoverMiddleY ) {
    return "upward";
  }
}


class BodyRow extends React.Component {

  render() {

    const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps
          } = this.props,

          style = { ...restProps.style, cursor: "move" };

    let className = restProps.className;

    if ( isOver && initialClientOffset ) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if ( direction === "downward" ) {
        className += " drop-over-downward";
      }
      if ( direction === "upward" ) {
        className += " drop-over-upward";
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr
          {...restProps}
          className={className}
          style={ style }
        />
      )
    );
  }
};

function getModel( className ) {
  return className.split( " " )
    .find( cl => cl.startsWith( "model--" ) );
}

const rowSource = {
        beginDrag( props ) {
          return {
            index: props.index,
            id: props[ "data-row-key" ],
            model: getModel( props[ "className" ])
          };
        }
      },

      rowTarget = {
        drop( props, monitor ) {
          const dragIndex = monitor.getItem().index,
                dragId = monitor.getItem().id,
                dragModel = monitor.getItem().model,
                hoverIndex = props.index,
                hoverId = props[ "data-row-key" ],
                hoverModel = getModel( props[ "className" ]);

          // Don"t replace items with themselves
          if ( dragIndex === hoverIndex || dragModel !== hoverModel ) {
            return;
          }
          // Time to actually perform the action
          props.moveRow( dragIndex, hoverIndex, dragId, hoverId );

          // Note: we're mutating the monitor item here!
          // Generally it's better to avoid mutations,
          // but it's good here for the sake of performance
          // to avoid expensive index searches.
          monitor.getItem().index = hoverIndex;
          monitor.getItem().id = props[ "data-row-key" ];

        }
      };

export const DragableRow = DropTarget( "row", rowTarget, ( connect, monitor ) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}) )(
  DragSource( "row", rowSource, ( connect, monitor ) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }) )( BodyRow )
);


export const connectDnD = DragDropContext( HTML5Backend );