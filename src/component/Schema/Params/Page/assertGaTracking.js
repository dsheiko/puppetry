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
    default:
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

  toGherkin: ({ params, assert }) => `Assert that method
    ga(${ render( assert ) }) was called on the page`,

  assert: {
    node: AssertGaTrackingBeacon
  },
  params: [
  ],

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "assertGaTracking",
        "action": "pageview"
      }
    },
    {
      valid: true,
      "assert": {
        "assertion": "assertGaTracking",
        "action": "event",
        "categoryAssertion": "contains",
        "actionAssertion": "equals",
        "labelAssertion": "equals",
        "valueAssertion": "equals",
        "categoryValue": "FOO",
        "actionValue": "BAR",
        "labelValue": "BAZ",
        "valueValue": "QUIX"
      }
    },
    {
      valid: true,
      "assert": {
        "assertion": "assertGaTracking",
        "action": "social",
        "networkAssertion": "equals",
        "targetAssertion": "equals",
        "networkValue": "FOO",
        "targetValue": "BAZ",
        "actionAssertion": "equals",
        "actionValue": "BAR"
      }
    }
  ]
};


