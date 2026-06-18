import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import Tooltip from "component/Global/Tooltip";
import { getSchema } from "component/Schema/schema";
import { truncate, extendToGherkin } from "service/utils";

export class CommandRowLabel extends React.Component {

   static propTypes = {
     record: PropTypes.object.isRequired,
     snippets: PropTypes.any
   }

   static highlightText( text ) {
     if ( !text.includes( "`" ) ) {
       return <span>{ text }</span>;
     }
     const chunks = text.split( "`" );
     return chunks.map( ( chunk, inx ) => {
       const isVar = inx % 2;

       return <span key={ inx } className={ isVar ? "label-variable" : "" }>
         { isVar ? `"${ truncate( chunk, 80 ) }"` : chunk }
       </span>;
     });
   }


   renderRef() {
     const { record, snippets } = this.props,
           title = snippets.hasOwnProperty( record.ref )
             ? snippets[ record.ref ].title
             : ( record.refName || "reference not found" );

     return ( <div className="container--editable-cell">
       <span className="command--ref">
         <Icon
           type="link"
           title="Reference to a snippet" />
         { title }
       </span>
       { record.comment && <i className="is-optional comment-label">
         <Icon type="message" title="Comment" /><span>{ record.comment }</span></i> }
     </div> );
   }

   shouldComponentUpdate( nextProps ) {
     const prev = this.props.record,
           next = nextProps.record;
     if ( !this.props.record ) {
       return false;
     }
     if ( prev.id !== next.id
          || prev.failure !== next.failure
          || prev.isRef !== next.isRef
          || prev.method !== next.method
          || prev.target !== next.target
          || prev.params !== next.params
          || prev.assert !== next.assert
          || prev.ref !== next.ref
          || prev.refName !== next.refName
          || prev.waitForTarget !== next.waitForTarget
          || prev.comment !== next.comment ) {
       return true;
     }
     return false;
   }

   renderCommand() {
     const { record } = this.props,
           schema = getSchema( record.target === "page" ? "page" : "target", record.method );

     return ( <div className="container--editable-cell">
       <Tooltip
         title={ record.failure }
         icon="exclamation-circle"
         pos="up" />
       <div className="gherkin">
         { CommandRowLabel.highlightText( extendToGherkin( record, schema.toGherkin( record ) ) ) }
       </div>
       { record.comment && <i className="is-optional comment-label">
         <Icon type="message" title="Comment" /><span>{ record.comment }</span></i> }
     </div> );
   }

   render() {
     const { record } = this.props;
     return record.ref ? this.renderRef() : this.renderCommand();
   }
}
