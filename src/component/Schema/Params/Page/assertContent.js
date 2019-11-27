import { buildAssertionTpl } from "service/assert";
import { AssertString } from "../../Assert/AssertString";
import { normalizeAssertionVerb } from "service/utils";

export const assertContent = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.content()`,
    command,
    `// Asserting that page HTML satisfies the given constraint`
  ),
  description: `Asserts that the page content (HTML) satisfies the given constraint`,
  commonly: "assert page HTML",

  toLabel: ({ assert }) => `(${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\`)`,

  toGherkin: ({ assert }) => `Assert that page
  content ${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\``,

  assert: {
    node: AssertString
  },
  params: [

  ],

  testTypes: {
    "assert": {
      "assertion": "SELECT",
      "value": "INPUT"
    }
  },

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
