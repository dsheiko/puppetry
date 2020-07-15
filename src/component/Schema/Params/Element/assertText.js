import { buildAssertionTpl } from "service/assert";
import { AssertText } from "../../Assert/AssertText";
import { normalizeAssertionVerb, normalizeAssertionValue, renderTarget } from "service/utils";

export const assertText = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( ${ renderTarget( command.target ) } ).getProp( "innerText" )`,
    command,
    `// Asserting that rendered text content of the focused element satisfies the given constraint`
  ),

  toLabel: ({ assert }) => {
    return `(${ normalizeAssertionVerb( assert.assertion ) }${ normalizeAssertionValue( assert )})`;
  },
  toGherkin: ({ target, assert }) => `Assert that HTML content of \`${ target }\`
    ${ normalizeAssertionVerb( assert.assertion ) }${ normalizeAssertionValue( assert )}`,

  commonly: "assert text",

  description: `Asserts that the rendered text content of the focused element satisfies the given constraint.
Unlike \`target.assertHtml\` this method takes pure text content without HTML, which
approximates the text the user would get if they highlighted the contents of the element with the cursor
and then copied it to the clipboard.`,
  assert: {
    node: AssertText
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
