import { buildAssertionTpl, stringifyTypes } from "service/assert";
import { AssertPerformanceMetrics } from "../../Assert/AssertPerformanceMetrics";


export const assertPerformanceTiming = {

  template: ( command ) => {
    return buildAssertionTpl(
      `JSON.parse( await bs.page.evaluate( () => JSON.stringify( window.performance.timing ) ) )`,
      command,
      `// Asserting timing\n`
    );
  },

  description: `Asserts a given [resource timing](https://w3c.github.io/perf-timing-primer/#resource-timing)
    under a provided budget`,
  commonly: "assert performance timing",

  toLabel: ({ assert }) => `(${ stringifyTypes( assert, "μs" ) })`,
  toGherkin: ({ assert }) => `Assert that the page loading
    timings satisfy the budget: ${ stringifyTypes( assert, "μs" ) }`,

  assert: {
    node: AssertPerformanceMetrics
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
        "assertion": "assertPerformanceTiming",
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


