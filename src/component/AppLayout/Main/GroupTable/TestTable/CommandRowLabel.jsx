import log from "electron-log";
import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import Tooltip from "component/Global/Tooltip";
import { truncate } from "service/utils";

const OPERATOR_MAP = {
  gt: ">",
  lt: "<"
};


export class CommandRowLabel extends React.Component {

   static propTypes = {
     record: PropTypes.object.isRequired
   }


   static buildPageAddon({ assert, method, params }) {
     let text;
     switch ( method ) {
     case "goto":
        return `(${ params.url }")`;
     case "assignVar":
        return `("${ params.name }", "${ params.value }")`;
     case "assignVarRemotely":
       return `("${ params.name }, ${ params.url }")`;
     case "press":
       text = [ params.modifierKey1,
         params.modifierKey2,
         params.modifierKey3,
         params.key ]
         .filter( key => Boolean( key ) )
         .map( key => `${ key }` )
         .join( "+" );
       return `("${ text }")`;
     case "emulate":
       return `("${ params.device }")`;
     case "scroll":
       return `(x: ${ params.x }, y: ${ params.y })`;
     case "querySelectorAll":
       return `("${ params.selector }")`;
     case "screenshot":
       return `("${ params.name }")`;
     case "click":
     case "moveMouse":
       return `(${ params.x }, ${ params.y })`;
     case "setCookie":
      return `(${ params.name }, ${ truncate( params.value, 20 ) })`;
     case "evaluate":
     case "runjs":
       return `(${ truncate( params.value, 80 ) })`;
     case "setViewport":
       return `(${ params.width }, ${ params.height },`
       + ` x${ params.deviceScaleFactor || 1 }${ params.isLandscape ? ", landscape" : "" })`;
     case "waitFor":
       return `(${ params.value })`;
     case "waitForSelector":
       text = ( params.visible === "on" ? " is visible" : ( params.hidden === "on"  ? " is hidden" : "" ) );
       return `("${ params.value }"${ text })`;
     case "waitForNavigation":
       return params.waitUntil ? `(${ params.waitUntil })` : `(${ params.timeout })`;
     case "assertNodeCount":
       return `(num of "${ params.selector }" ${ OPERATOR_MAP[ assert.operator ] } ${ assert.value })`;
     case "assertContent":
     case "assertTitle":
     case "assertUrl":
     case "assertVar":
       return assert.value ? `("${ truncate( assert.value, 20 ) }")` : "";
     case "assertScroll":
       return params.direction === "horizontally"
         ? `(scrollX ${ OPERATOR_MAP[ assert.operator ] }  ${ assert.value })`
         : `(scrollY ${ OPERATOR_MAP[ assert.operator ] }  ${ assert.value })`;
     default:
       return "()";
     }
   }

   static buildTargetAddon({ assert, method, params, target }) {
     try {
       let text;
       switch ( method ) {
       case "assertProperty":
       case "assertAttribute":
       case "toggleClass":
         return `("${ params.name }")`;
       case "checkBox":
         return `("${ params.checked ? "checked" : "unchecked" }")`;
       case "setAttribute":
         return `("${ params.name }", "${ params.value }")`;
       case "assertStyle":
         return `("${ params.name }", "${ params.pseudo || "null" }")`;
       case "assertContainsClass":
         return `(${ assert.value ? "" : "NOT " }"${ params.name }")`;
       case "scroll":
         return `(h: ${ params.x }, v: ${ params.y })`;
       case "select":
       case "type":
         return `("${ params.value }")`;
       case "upload":
         return `("${ params.path }")`;
       case "assertVisible":
         return `("${ assert.value ? "true" : "false" }")`;
       case "assertScroll":
         return params.direction === "horizontally"
           ? `(scrollLeft ${ OPERATOR_MAP[ assert.operator ] }  ${ assert.value })`
           : `(scrollTop ${ OPERATOR_MAP[ assert.operator ] }  ${ assert.value })`;
       case "assertMatchesSelector":
         return `("${ assert.value }")`;
       case "assertHtml":
         return assert.value ? `("${ truncate( assert.value, 20 ) }")` : "";
       case "assertBoundingBox":
         return `(x ${ OPERATOR_MAP[ assert.xOperator ] } ${ assert.xValue }, `
              + `y ${ OPERATOR_MAP[ assert.yOperator ] } ${ assert.yValue }, `
              + `w ${ OPERATOR_MAP[ assert.wOperator ] } ${ assert.wValue }, `
              + `h ${ OPERATOR_MAP[ assert.hOperator ] } ${ assert.hValue })`;
       case "assertPosition":
         text = [ "left", "right" ].includes( assert.position )
           ? assert.position + " to" : assert.position;
         return `(${ target } is ${ text } ${ assert.target })`;
       default:
         return "()";
       }
     } catch ( err ) {
       log.warn( `Renderer process: CommandRowLabel::buildTargetAddon: ${ err }` );
     }
   }

   static buildAddon( record ) {
     if ( record.target === "page" ) {
       return CommandRowLabel.buildPageAddon( record );
     }
     return CommandRowLabel.buildTargetAddon( record );
   }


   renderRef() {
     const { record, snippets } = this.props,
            title = snippets.hasOwnProperty( record.ref ) ? snippets[ record.ref ].title : "reference not found";

     return ( <div className="container--editable-cell command--ref">
       <Icon
          type="link"
          title="Reference to a snippet" />
       { title }
     </div> );
   }

   renderCommand() {
     const { record } = this.props;
     return ( <div className="container--editable-cell">
       <Tooltip
         title={ record.failure }
         icon="exclamation-circle"
         pos="up" />
       <Icon
          type={ record.target === "page" ? "file" : "scan" }
          title={ record.target === "page" ? "Page method" : `${ record.target } target method` } />
       <span className="token--target">{ record.target }</span>.{ record.method }
       <span className="token--param">{ CommandRowLabel.buildAddon( record ) }</span>

     </div> );
   }

   render() {
     const { record } = this.props;
     return record.ref ? this.renderRef() : this.renderCommand();
   }
}
