import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { truncate, normalizeAssertionVerb } from "service/utils";

export const assertUrl = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.url()`,
    command,
    `// Asserting that page URL satisfies the given constraint`
  ),


  toLabel: ({ assert }) => `(${ normalizeAssertionVerb( assert.assertion ) } \`${  assert.value }\`)`,
  toGherkin: ({ params, assert }) => `Assert that
    page URL ${ normalizeAssertionVerb( assert.assertion ) } \`${  assert.value }\``,

  commonly: "assert page URL",

  description: `Asserts that the page URL satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [

  ]
};
