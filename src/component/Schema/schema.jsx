import React from "react";
import { screenshot } from "./Params/Page/screenshot";
import { setViewport } from "./Params/Page/setViewport";
import { assertContent } from "./Params/Page/assertContent";
import { assertTitle } from "./Params/Page/assertTitle";
import { emulate } from "./Params/Page/emulate";
import { clickMouse } from "./Params/Page/clickMouse";
import { tapTouchscreen } from "./Params/Page/tapTouchscreen";
import { goto } from "./Params/Page/goto";
import { reload } from "./Params/Page/reload";
import { waitFor } from "./Params/Page/waitFor";
import { press } from "./Params/Page/press";

import { waitForNavigation } from "./Params/Page/waitForNavigation";
import { assertNodeCount } from "./Params/Page/assertNodeCount";
import { assertProperty } from "./Params/Element/assertProperty";
import { assertAttribute } from "./Params/Element/assertAttribute";
import { assertVisible } from "./Params/Element/assertVisible";
import { type } from "./Params/Element/type";
import { assertHtml } from "./Params/Element/assertHtml";
import { focus } from "./Params/Element/focus";
import { click } from "./Params/Element/click";
import { hover } from "./Params/Element/hover";
import { select } from "./Params/Element/select";
import { assertBoundingBox } from "./Params/Element/assertBoundingBox";
import { assertPosition } from "./Params/Element/assertPosition";
import { assertStyle } from "./Params/Element/assertStyle";
import { assertMatchesSelector } from "./Params/Element/assertMatchesSelector";
import { toggleClass } from "./Params/Element/toggleClass";
import { assertContainsClass } from "./Params/Element/assertContainsClass";
import { setAttribute } from "./Params/Element/setAttribute";
import { tap } from "./Params/Element/tap";


import { tplQuery, tplSuite, tplGroup, tplTest } from "./Jest";

const methodLables = {
  emulate: "emulate device",
  setViewport: "set window size",
  clickMouse: "click mouse",
  tapTouchscreen: "tap",
  press: "press a key",
  screenshot: "make screenshot",
  assertTitle: "assert page title",
  assertContent: "assert page HTML",
  waitFor: "wait for time/selector",
  waitForNavigation: "wait for navigation",
  assertNodeCount: "assert count of elements",

  toggleClass: "toggle class",
  setAttribute: "set attribute",
  assertAttribute: "assert attribute",
  assertProperty: "assert property",
  assertVisible: "assert it is visible",
  assertHtml: "assert HTML",
  assertBoundingBox: "assert size/position",
  assertPosition: "assert relative position",
  assertStyle: "assert style",
  assertMatchesSelector: "assert it matches selector",
  assertContainsClass: "assert it contains class"
};

export function displayMethod( method ) {
  return method in methodLables
    ? ( <span className="method-title">{ methodLables[ method ] + " " } <i>({ method })</i></span> )
    : method;
}

export const schema = {
  jest: {
    tplQuery,
    tplSuite,
    tplGroup,
    tplTest
  },
  element: {
    type,
    select,
    focus,
    click,
    tap,
    hover,
    toggleClass,
    setAttribute,
    assertAttribute,
    assertProperty,
    assertVisible,
    assertHtml,
    assertBoundingBox,
    assertPosition,
    assertStyle,
    assertMatchesSelector,
    assertContainsClass
  },
  page: {
    emulate,
    setViewport,
    goto,
    screenshot,
    clickMouse,
    tapTouchscreen,
    press,
    reload,
    waitFor,
    waitForNavigation,
    assertTitle,
    assertContent,
    assertNodeCount
  }
};


export function getSchema( target, method ) {
  const targetType = target === "page" ? "page" : "element";

  if ( !schema.hasOwnProperty( targetType ) ) {
    return null;
  }
  if ( !schema[ targetType ].hasOwnProperty( method ) ) {
    return null;
  }
  return schema[ targetType ][ method ];
}