import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertAssertWeight } from "../../Assert/AssertAssertWeight";
import ExpressionParser from "service/ExpressionParser";
import { truncate, normalizeAssertionVerb } from "service/utils";


function typesToString( assert ) {
  return Object.keys( assert._enabled )
    .filter( ( key ) => assert._enabled[ key ] )
    .map( ( el ) => `\`${ el }\`` ).join( ", " );
}

export const assertPerfomanceAssetWeight = {
  template: ( command ) => {
    return buildAssertionTpl(
      `bs.performance.resources`,
      command,
      `// Asserting that total weight of assets satisfies the given budget\n`
      + `util.saveResourceReport( "${ command.id }", bs.performance.resources )\n`
    );
  },

  toLabel: ({ params, assert }) => `(${ typesToString( assert ) })`,
  toText: ({ params, assert }) => `(${ typesToString( assert ) })`,

  commonly: "assert weight of assets",

  description: `Asserts that total weight of assets
  (JavaScript, CSS, images, media, fonts, XHR) on the page satisfies the given budget.

   This assertion makes Puppetry to intercept HTTP requests. It compares the given limits to the encoded length
   of the requests. Note that the request length is considered \`0\` when request loaded from cache.
   So it makes sense to place this step next to the very first \`page.goto\` in the test suite.
  `,
  assert: {
    node: AssertAssertWeight
  }
};
