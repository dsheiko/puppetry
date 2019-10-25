import React from "react";
import { TIPS } from "constant";

export default function LoadingTip() {
  const html = TIPS[ Math.floor( Math.random() * TIPS.length ) ];
  return ( <div className="loading-tip">{ html.split( "<br />" )
    .map( ( text, inx ) => ( <div key={ inx }>{ text }</div> ) ) }</div> );
}
