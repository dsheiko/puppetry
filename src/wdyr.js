// @See https://www.npmjs.com/package/@welldone-software/why-did-you-render
import React from "react";

if ( process.env.NODE_ENV !== "production" ) {
  const whyDidYouRender = require( "@welldone-software/why-did-you-render" );
  whyDidYouRender( React, {
    trackAllPureComponents: true
  });
}