import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { truncate } from "service/utils";

export const assertTitle = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.title()`,
    command,
    `// Asserting that page title satisfies the given constraint`
  ),

  toLabel: ({ assert }) => `(${ assert.assertion } \`${ truncate( assert.value, 60 ) }\`)`,
  toText: ({ assert }) => `(${ assert.assertion } \`${  assert.value, 60 }\`)`,
  commonly: "assert page title",

  description: `Asserts that the page title satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [

  ]
};
