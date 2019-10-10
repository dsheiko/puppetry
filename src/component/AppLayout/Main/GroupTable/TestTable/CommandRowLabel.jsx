import log from "electron-log";
import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import Tooltip from "component/Global/Tooltip";
import { getSchema } from "component/Schema/schema";
import { truncate } from "service/utils";

export class CommandRowLabel extends React.Component {

   static propTypes = {
     record: PropTypes.object.isRequired,
     snippets: PropTypes.any
   }

   static buildAddon( record ) {
     try {
       const schema = getSchema( record.target === "page" ? "page" : "target", record.method ),
             res = typeof schema.toLabel === "function" ? schema.toLabel( record ) : "";
       return res ? CommandRowLabel.highlightText( res ) : "()";
     } catch ( err ) {
       log.warn( `Renderer process: CommandRowLabel::buildTargetAddon: ${ err }` );
     }
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
       { record.comment && <i className="is-optional">
         <br /><Icon type="message" title="Comment" />{ " " } { record.comment }</i> }
     </div> );
   }

   renderCommand() {
     const { record } = this.props,
           schema = getSchema( record.target === "page" ? "page" : "target", record.method );
     return ( <div className="container--editable-cell">
       <Tooltip
         title={ record.failure }
         icon="exclamation-circle"
         pos="up" />

    { typeof schema.toGherkinQ === "function" && CommandRowLabel.highlightText( schema.toGherkin( record ) ) }
    { typeof schema.toGherkinQ !== "function" && <React.Fragment>
       <Icon
         type={ record.target === "page" ? "file" : "scan" }
         title={ record.target === "page" ? "Page method" : `${ record.target } target method` } />
       <span className="token--target">{ record.target }</span>.{ record.method }
       <span className="token--param">{ CommandRowLabel.buildAddon( record ) }</span>
       </React.Fragment> }
       { record.comment && <i className="is-optional">
        <br /><Icon type="message" title="Comment" />{ " " } { record.comment }</i> }
     </div> );
   }

   render() {
     const { record } = this.props;
     return record.ref ? this.renderRef() : this.renderCommand();
   }
}
