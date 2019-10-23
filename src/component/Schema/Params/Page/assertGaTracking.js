import { buildAssertionTpl } from "service/assert";
import { AssertGaTrackingBeacon } from "../../Assert/AssertGaTrackingBeacon";
import { truncate } from "service/utils";
import { CHECKBOX, INPUT } from "../../constants";
import GS_SCHEMA from "component/Schema/Assert/gaSchema";

function renderVals( arr ) {
  return arr.map( val => `\`${ val }\`` ).join( ", " );
}

function renderLabel({ action }) {
 if ( typeof GS_SCHEMA[ action ] !== "undefined" && GS_SCHEMA[ action ].label ) {
  return GS_SCHEMA[ action ].label;
 }
 return action;
}

function renderParams({ action, ...a }, prefix = "" ) {
  const params = GS_SCHEMA[ action ].fields.map( field => {
    const val = a[ `${ field.key }Value` ],
          opa = a[ `${ field.key }Assertion` ];

    switch( opa ) {
      case "equals":
        return `${ field.key } \`${ val }\``;
      case "contains":
        return `${ field.key } \`..${ val }..\``;
      case "any":
        return ``;
      default:
        return `${ field.key } \`${ val ? "true" : "false" }\``;
    }
  }).filter( val => val.length );

  if ( !params.length ) {
    return "";
  }
  return `${ prefix } ${ params.join( ", " ) }`;
}

export const assertGaTracking = {

  template: ( command ) => {
    return buildAssertionTpl(
      `bs.getGaTracking()`,
      command,
      `// Asserting GA tracking\n`
    );
  },

  description: `Asserts a given action was sent to
Google Analytics with
[analytics.js](https://developers.google.com/analytics/devguides/collection/analyticsjs)
or [gtag.js](https://developers.google.com/analytics/devguides/collection/gtagjs).
We also assert that sent payloads are valid according to the Google API`,
  commonly: "assert GA tracking",

  toLabel: ({ assert }) => `(\`${ renderLabel( assert ) }\` ${ renderParams( assert, "with" ) })`,

  toGherkin: ({ params, assert }) => `Assert that
    \`${ renderLabel( assert ) }\` data were to Google Analytics ${ renderParams( assert, "with" ) }`,

  assert: {
    node: AssertGaTrackingBeacon
  },
  params: [
  ],

  testTypes: {
    "assert": {
      "action": "SELECT"
//      "categoryAssertion": "SELECT",
//      "actionAssertion": "SELECT",
//      "labelAssertion": "SELECT",
//      "valueAssertion": "SELECT",
//      "categoryValue": "INPUT",
//      "actionValue": "INPUT",
//      "labelValue": "INPUT",
//      "valueValue": "INPUT"
    }
  },

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


