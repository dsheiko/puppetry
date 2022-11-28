import log from "electron-log";
import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import Tooltip from "component/Global/Tooltip";
import { getSchema } from "component/Schema/schema";
import { truncate, extendToGherkin } from "service/utils";
import { connect } from "react-redux";
import * as selectors from "selector/selectors";

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        testCaseStyle: state.settings.testCaseStyle,
        snippetsTests: selectors.getSnippetsMemoized( state )
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      });

@connect( mapStateToProps, mapDispatchToProps )
export class CommandRowLabel extends React.Component {

   static propTypes = {
     record: PropTypes.object.isRequired,
     snippetsTests: PropTypes.any,
     testCaseStyle: PropTypes.string
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
     const { record, snippetsTests } = this.props,
           title = snippetsTests.hasOwnProperty( record.ref )
             ? snippetsTests[ record.ref ].title
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
     if ( this.props.snippetsTests !== nextProps.snippetsTests ) {
       return true;
     }
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
          || prev.comment !== next.comment
          || this.props.testCaseStyle !== nextProps.testCaseStyle ) {
       return true;
     }
     return false;
   }

   renderCommand() {
     const { record, testCaseStyle } = this.props,
           testStyle = testCaseStyle || "gherkin",
           schema = getSchema( record.target === "page" ? "page" : "target", record.method );

     return ( <div className="container--editable-cell">
       <Tooltip
         title={ record.failure }
         icon="exclamation-circle"
         pos="up" />

       { testStyle === "gherkin" && <div className="gherkin">
         { CommandRowLabel.highlightText( extendToGherkin( record, schema.toGherkin( record ) ) ) }
       </div> }
       { testStyle !== "gherkin" && <React.Fragment>
         { record.waitForTarget && <React.Fragment>
           <Icon
             type={ record.target === "page" ? "file" : "scan" }
             title={ record.target === "page" ? "Page method" : `${ record.target } target method` } />
           <span className="token--target">{ record.target }</span>.waitForTarget
           <span className="token--param">()</span><br />
         </React.Fragment> }
         <Icon
           type={ record.target === "page" ? "file" : "scan" }
           title={ record.target === "page" ? "Page method" : `${ record.target } target method` } />
         <span className="token--target">{ record.target }</span>.{ record.method }
         <span className="token--param">{ CommandRowLabel.buildAddon( record ) }</span>
       </React.Fragment> }
       { record.comment && <i className="is-optional comment-label">
         <Icon type="message" title="Comment" /><span>{ record.comment }</span></i> }
     </div> );
   }

   render() {
     const { record } = this.props;
     return record.ref ? this.renderRef() : this.renderCommand();
   }
}
