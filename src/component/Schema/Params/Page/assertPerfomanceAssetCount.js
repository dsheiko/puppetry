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

  toLabel: ({ params, assert }) => `(${ stringifyTypes( assert ) })`,
  toText: ({ params, assert }) => `(${ stringifyTypes( assert ) })`,

  commonly: "assert count of assets",

  description: `Asserts that total number of requested assets `
    + `(JavaScript, CSS, images, media, fonts, XHR) on the page satisfies the given budget`,
  assert: {
    node: AssertAssertCount
  }
};
