import React from "react";
import { screenshot as screenshotPage } from "./Params/Page/screenshot";
import { setViewport } from "./Params/Page/setViewport";
import { assertContent } from "./Params/Page/assertContent";
import { assertTitle } from "./Params/Page/assertTitle";
import { assertUrl } from "./Params/Page/assertUrl";
import { emulate } from "./Params/Page/emulate";
import { click as clickPage } from "./Params/Page/click";
import { moveMouse } from "./Params/Page/moveMouse";
import { tap as tapPage } from "./Params/Page/tap";
import { goto } from "./Params/Page/goto";
import { reload } from "./Params/Page/reload";
import { waitFor } from "./Params/Page/waitFor";
import { waitForSelector } from "./Params/Page/waitForSelector";
import { press } from "./Params/Page/press";
import { evaluate } from "./Params/Page/evaluate";
import { runjs } from "./Params/Page/runjs";
import { debug } from "./Params/Page/debug";
import { assignVarRemotely } from "./Params/Page/assignVarRemotely";
import { assignVar } from "./Params/Page/assignVar";
import { assertVar } from "./Params/Page/assertVar";
import { scroll as scrollPage } from "./Params/Page/scroll";
import { setCookie } from "./Params/Page/setCookie";
import { assertScroll as assertScrollPage } from "./Params/Page/assertScroll";
import { waitForNavigation } from "./Params/Page/waitForNavigation";
import { assertNodeCount as assertNodeCountPage } from "./Params/Page/assertNodeCount";

import { screenshot as screenshotElement } from "./Params/Element/screenshot";
import { assertProperty } from "./Params/Element/assertProperty";
import { assertAttribute } from "./Params/Element/assertAttribute";
import { assertVisible } from "./Params/Element/assertVisible";
import { type } from "./Params/Element/type";
import { upload } from "./Params/Element/upload";
import { assertHtml } from "./Params/Element/assertHtml";
import { focus } from "./Params/Element/focus";
import { click } from "./Params/Element/click";
import { hover } from "./Params/Element/hover";
import { reset } from "./Params/Element/reset";
import { select } from "./Params/Element/select";
import { assertBoundingBox } from "./Params/Element/assertBoundingBox";
import { assertPosition } from "./Params/Element/assertPosition";
import { assertStyle } from "./Params/Element/assertStyle";
import { assertMatchesSelector } from "./Params/Element/assertMatchesSelector";
import { toggleClass } from "./Params/Element/toggleClass";
import { assertContainsClass } from "./Params/Element/assertContainsClass";
import { setAttribute } from "./Params/Element/setAttribute";
import { tap as tapElement } from "./Params/Element/tap";
import { scroll as scrollElement } from "./Params/Element/scroll";
import { assertScroll as assertScrollElement } from "./Params/Element/assertScroll";
import { checkBox }  from "./Params/Element/checkBox";
import { assertNodeCount as assertNodeCountElement } from "./Params/Element/assertNodeCount";
import { assertTextCount as assertTextCountElement } from "./Params/Element/assertTextCount";


import { tplQuery, tplSuite, tplGroup, tplTest } from "./Jest";

const methodLables = {
  page: {
    emulate: "emulate device",
    setViewport: "set window size",
    click: "click mouse",
    moveMouse: "move mouse",
    tapTouchscreen: "tap",
    press: "press a key",
    setCookie: "set page cookies",
    screenshot: "make screenshot",
    assertTitle: "assert page title",
    assertUrl: "assert page URL",
    assertContent: "assert page HTML",
    waitFor: "wait for timeout",
    waitForSelector: "wait for selector",
    waitForNavigation: "wait for navigation",
    assignVar: "set template variable dynamically",
    assignVarRemotely: "set template variable with webhook",
    assertNodeCount: "assert count of elements",
    assertScroll: "assert window scroll offset",
    assertVar: "assert template variable value",
    evaluate: "evaluate JavaScript in the page context",
    runjs: "run custom JavaScript in the suite",
    debug: "stop execution and call DevTools"
  },
  element: {
    upload: "attach a file to file input",
    reset: "reset input or form",
    toggleClass: "toggle class",
    checkBox: "toggle checkbox/radio",
    screenshot: "make screenshot",
    setAttribute: "set attribute",
    assertAttribute: "assert attribute",
    assertProperty: "assert property",
    assertVisible: "assert it is visible",
    assertHtml: "assert HTML",
    assertBoundingBox: "assert size/position",
    assertPosition: "assert relative position",
    assertStyle: "assert style",
    assertMatchesSelector: "assert it matches selector",
    assertNodeCount: "assert count of child elements",
    assertTextCount: "assert count of elements with text",
    assertContainsClass: "assert it contains class",
    assertScroll: "assert scroll offset"
  }
};

export function displayMethod( target, method ) {
  return method in methodLables[ target ]
    ? ( <span className="method-title" data-keyword={ method }>{
      methodLables[ target ][ method ] + " " } <i>({ method })</i></span> )
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
    reset,
    upload,
    tap: tapElement,
    scroll: scrollElement,
    hover,
    checkBox,
    toggleClass,
    setAttribute,
    screenshot: screenshotElement,
    assertAttribute,
    assertProperty,
    assertVisible,
    assertHtml,
    assertBoundingBox,
    assertPosition,
    assertStyle,
    assertMatchesSelector,
    assertNodeCount: assertNodeCountElement,
    assertTextCount: assertTextCountElement,
    assertContainsClass,
    assertScroll: assertScrollElement
  },
  page: {
    emulate,
    setViewport,
    goto,
    screenshot: screenshotPage,
    click: clickPage,
    moveMouse,
    tap: tapPage,
    press,
    scroll: scrollPage,
    reload,
    setCookie,
    waitFor,
    waitForSelector,
    waitForNavigation,
    evaluate,
    runjs,
    debug,
    assignVar,
    assignVarRemotely,
    assertTitle,
    assertUrl,
    assertContent,
    assertNodeCount: assertNodeCountPage,
    assertScroll: assertScrollPage,
    assertVar
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