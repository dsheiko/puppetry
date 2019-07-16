import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { truncate } from "service/utils";

export const assertContent = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.content()`,
    command,
    `// Asserting that page HTML satisfies the given constraint`
  ),
  description: `Asserts that the page content (HTML) satisfies the given constraint`,
  commonly: "assert page HTML",

  toLabel: ({ assert }) => `(${ assert.assertion } \`${ truncate( assert.value, 60 ) }\`)`,
  toText: ({ assert }) => `(${ assert.assertion } \`${ assert.value }\`)`,

  assert: {
    node: AssertValue
  },
  params: [

  ]
};
