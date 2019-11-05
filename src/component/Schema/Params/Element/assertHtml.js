import { buildAssertionTpl } from "service/assert";
import { AssertString } from "../../Assert/AssertString";
import { normalizeAssertionVerb, renderTarget } from "service/utils";

export const assertHtml = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( ${ renderTarget( command.target ) } ).getProp( "innerHTML" )`,
    command,
    `// Asserting that HTML content of the focused element satisfies the given constraint`
  ),

  toLabel: ({ assert }) => {
    return assert.value ? `(${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\`)`
      : "";
  },
  toGherkin: ({ target, assert }) => `Assert that text content of \`${ target }\`
    ${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\``,

  commonly: "assert HTML",

  description: `Asserts that the HTML content of the focused element satisfies the given constraint`,
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
        "value": "ipsum"
      }
    }
  ]
};
