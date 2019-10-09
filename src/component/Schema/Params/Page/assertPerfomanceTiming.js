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
  toText: ({ assert }) => `(${ stringifyTypes( assert ) })`,

  assert: {
    node: AssertPerfomanceMetrics
  },
  params: [
  ]
};


