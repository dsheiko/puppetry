import { INPUT } from "../../constants";
import { buildAssertionTpl, stringifyTypes } from "service/assert";
import { AssertAssertWeight } from "../../Assert/AssertAssertWeight";
import ExpressionParser from "service/ExpressionParser";
import { truncate, normalizeAssertionVerb } from "service/utils";

export const assertPerfomanceAssetWeight = {
  template: ( command ) => {
    return buildAssertionTpl(
      `bs.performance.resources`,
      command,
      `// Asserting that total weight of assets satisfies the given budget\n`
      + `util.saveResourceReport( "${ command.id }", bs.performance.resources )\n`
    );
  },

  toLabel: ({ params, assert }) => `(${ stringifyTypes( assert ) })`,
  toGherkin: ({ params, assert }) => `Assert that the total weight of assets
    requested by the page satisfies the budget: ${ stringifyTypes( assert, "kB" ) }`,

  commonly: "assert weight of assets",

  description: `Asserts that total weight of assets
  (JavaScript, CSS, images, media, fonts, XHR) on the page satisfies the given budget.

   This assertion makes Puppetry to intercept HTTP requests. It compares the given limits to the encoded length
   of the requests. Note that the request length is considered \`0\` when request loaded from cache.
   So it makes sense to place this step next to the very first \`page.goto\` in the test suite.
  `,
  assert: {
    node: AssertAssertWeight
  },

  testTypes: {
      "assert": {
        "_enabled.script": "SWITCH",
        "script": "INPUT_NUMBER"
      }
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "assertAssetWeight",
        "_enabled": {
          "script": true,
          "stylesheet": false,
          "image": false,
          "media": false,
          "font": false,
          "xhr": false
        },
        "script": "11"
      },
      "params": {
        "url": "https://puppetry.app"
      }
    }
  ]
};
