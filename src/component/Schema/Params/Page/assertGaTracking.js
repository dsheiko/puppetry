import { buildAssertionTpl } from "service/assert";
import { AssertGaTrackingBeacon } from "../../Assert/AssertGaTrackingBeacon";
import { truncate } from "service/utils";
import { CHECKBOX, INPUT } from "../../constants";

function renderVals( arr ) {
  return arr.map( val => `\`${ val }\`` ).join( ", " );
}

function render({ action, categoryValue, actionValue, labelValue, valueValue, networkValue, targetValue }) {
  switch ( action ) {
    case "event":
      return renderVals([ action, categoryValue, actionValue, labelValue ]);
    case "social":
      return renderVals([ action, networkValue, actionValue, targetValue ]);
    case "default":
      return renderVals([ action ]);
  }
}

export const assertGaTracking = {

  template: ( command ) => {
    return buildAssertionTpl(
      `bs.getGaTracking()`,
      command,
      `// Asserting GA tracking\n`
    );
  },

  description: `Asserts a given action is tracked by
[Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs).`,
  commonly: "assert GA tracking",

  toLabel: ({ assert }) => `(${ render( assert ) })`,
  toText: ({ assert }) => `(${ render( assert ) } )`,

  assert: {
    node: AssertGaTrackingBeacon
  },
  params: [
  ]
};


