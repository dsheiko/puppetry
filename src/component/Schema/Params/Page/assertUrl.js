import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { truncate } from "service/utils";

export const assertUrl = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.url()`,
    command,
    `// Asserting that page URL satisfies the given constraint`
  ),

  toLabel: ({ assert }) => `(${ assert.assertion } \`${ truncate( assert.value, 60 ) }\`)`,
  toText: ({ assert }) => `(${ assert.assertion } \`${  assert.value, 60 }\`)`,
  commonly: "assert page URL",

  description: `Asserts that the page URL satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [

  ]
};
