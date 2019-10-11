import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { truncate, normalizeAssertionVerb } from "service/utils";

export const assertContent = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.content()`,
    command,
    `// Asserting that page HTML satisfies the given constraint`
  ),
  description: `Asserts that the page content (HTML) satisfies the given constraint`,
  commonly: "assert page HTML",

  toLabel: ({ assert }) => `(${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\`)`,

  toGherkin: ({ params, assert }) => `Assert that page
  content ${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\``,

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
        "value": "AAA"
      }
    }
  ]
};
