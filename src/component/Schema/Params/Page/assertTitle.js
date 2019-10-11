import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { truncate, normalizeAssertionVerb } from "service/utils";

export const assertTitle = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.title()`,
    command,
    `// Asserting that page title satisfies the given constraint`
  ),

  toLabel: ({ assert }) => `(${ normalizeAssertionVerb( assert.assertion ) } \`${  assert.value }\`)`,
  toGherkin: ({ params, assert }) => `Assert that
    page title ${ normalizeAssertionVerb( assert.assertion ) } \`${  assert.value }\``,

  commonly: "assert page title",

  description: `Asserts that the page title satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [

  ],

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "!equals",
        "type": "string",
        "value": "AA"
      }
    }
  ]
};
