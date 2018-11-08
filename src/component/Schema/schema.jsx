import { screenshot } from "./Params/Page/screenshot";
import { setViewport } from "./Params/Page/setViewport";
import { assertContent } from "./Params/Page/assertContent";
import { assertTitle } from "./Params/Page/assertTitle";
import { emulate } from "./Params/Page/emulate";
import { clickMouse } from "./Params/Page/clickMouse";
import { goto } from "./Params/Page/goto";
import { waitFor } from "./Params/Page/waitFor";
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


import { tplQuery, tplSuite, tplGroup, tplTest } from "./Jest";

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
    clickMouse,
    goto,
    screenshot,
    assertTitle,
    assertContent,
    waitFor,
    waitForNavigation,
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