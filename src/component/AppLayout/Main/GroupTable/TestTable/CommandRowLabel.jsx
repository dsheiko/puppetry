import log from "electron-log";
import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import Tooltip from "component/Global/Tooltip";

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
       return `("${ params.url }")`;
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
     case "evaluate":
     case "runjs":
       return `(${ params.value.trim().substr( 0, 80 ) }...)`;
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
       text = assert.value.length > 20 ? "..." : "";
       return assert.value ? `("${ assert.value.substr( 0, 20 ) + text }")` : "";
     case "assertScroll":
       return params.direction === "horizontally"
         ? `(scrollX ${ OPERATOR_MAP[ assert.operator ] }  ${ assert.value })`
         : `(scrollY ${ OPERATOR_MAP[ assert.operator ] }  ${ assert.value })`;
     default:
       return "";
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
         text = assert.value.length > 20 ? "..." : "";
         return assert.value ? `("${ assert.value.substr( 0, 20 ) + text }")` : "";
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
         return "";
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

   render() {
     const { record } = this.props;
     return ( <div className="container--editable-cell">
       <Tooltip
         title={ record.failure }
         icon="exclamation-circle"
         pos="up" />
       <Icon type={ record.target === "page" ? "file" : "scan" } />
       <span className="token--target">{ record.target }</span>.{ record.method }
       <span className="token--param">{ CommandRowLabel.buildAddon( record ) }</span>

     </div> );
   }
}
