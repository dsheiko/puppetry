import { buildAssertionTpl, stringifyTypes } from "service/assert";
import { AssertPerfomanceMetrics } from "../../Assert/AssertPerfomanceMetrics";
import { truncate } from "service/utils";
import { CHECKBOX, INPUT } from "../../constants";

function renderVals( arr ) {
  return arr.map( val => `\`${ val }\`` ).join( ", " );
}


export const assertPerfomanceTiming = {

  template: ( command ) => {
    return buildAssertionTpl(
      `JSON.parse( await bs.page.evaluate( () => JSON.stringify( window.performance.timing ) ) )`,
      command,
      `// Asserting timing\n`
    );
  },

  description: `Asserts a given [resource timing](https://w3c.github.io/perf-timing-primer/#resource-timing)
    under a provided budget`,
  commonly: "assert perfomance timing",

  toLabel: ({ assert }) => `(${ stringifyTypes( assert ) })`,
  toGherkin: ({ params, assert }) => `Assert that the page loading
    timings satisfy the budget: ${ stringifyTypes( assert, "kB" ) }`,

  assert: {
    node: AssertPerfomanceMetrics
  },
  params: [
  ],

  testTypes: {
    "assert": {
      "_enabled.network": "SWITCH",
      "network": "INPUT_NUMBER"
    }
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "assertPerfomanceTiming",
        "_enabled": {
          "loading": true,
          "redirection": false,
          "network": true,
          "processing": true
        },
        "loading": "4",
        "network": "1",
        "processing": "2"
      }
    }
  ]
};


