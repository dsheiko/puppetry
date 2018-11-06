import log from "electron-log";
import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";

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
     case "emulate":
       return `("${ params.device }")`;
     case "querySelectorAll":
       return `("${ params.selector }")`;
     case "screenshot":
       return `("${ params.name }")`;
     case "clickMouse":
       return `(${ params.x }, ${ params.y })`;
     case "setViewport":
       return `(${ params.width }, ${ params.height })`;
     case "waitFor":
       return `(${ params.value })`;
     case "waitForNavigation":
       return params.waitUntil ? `(${ params.waitUntil })` : `(${ params.timeout })`;
     case "assertNodeCount":
       return `(num of "${ params.selector }" ${ OPERATOR_MAP[ assert.operator ] } ${ assert.value })`;
     case "assertContent":
     case "assertTitle":
       text = assert.value.length > 20 ? "..." : "";
       return assert.value ? `("${ assert.value.substr( 0, 20 ) + text }")` : "";

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
         return `("${ params.name }")`;
       case "assertStyle":
         return `("${ params.name }", "${ params.pseudo || "null" }")`;
       case "select":
       case "type":
         return `("${ params.value }")`;
       case "assertVisible":
         return `("${ assert.value ? "true" : "false" }")`;
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
       <Icon type={ record.target === "page" ? "file" : "scan" } />
       <span className="token--target">{ record.target }</span>.{ record.method }
       <span className="token--param">{ CommandRowLabel.buildAddon( record ) }</span>
     </div> );
   }
}
