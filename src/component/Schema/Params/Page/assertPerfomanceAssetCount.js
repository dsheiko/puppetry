import { INPUT } from "../../constants";
import { buildAssertionTpl, stringifyTypes } from "service/assert";
import { AssertAssertCount } from "../../Assert/AssertAssertCount";
import ExpressionParser from "service/ExpressionParser";
import { truncate, normalizeAssertionVerb } from "service/utils";

export const assertPerfomanceAssetCount = {
  template: ( command ) => {

    return buildAssertionTpl(
      `bs.performance.resources`,
      command,
      `// Asserting that total number of assets satisfies the given budget`
    );
  },


  toLabel: ({ params, assert }) => `(${ stringifyTypes( assert, "kB" ) })`,

  toGherkin: ({ params, assert }) => `Assert that the total amount of assets
    requested by the page satisfies the budget: ${ stringifyTypes( assert, "kB" ) }`,

  commonly: "assert count of assets",

  description: `Asserts that total number of requested assets `
    + `(JavaScript, CSS, images, media, fonts, XHR) on the page satisfies the given budget`,
  assert: {
    node: AssertAssertCount
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "assertAssetCount",
        "_enabled": {
          "script": true,
          "stylesheet": false,
          "image": true,
          "media": false,
          "font": false,
          "xhr": false
        },
        "script": "22",
        "image": "2"
      },
      "params": {
        "url": "asdasd"
      }
    }
  ]
};
