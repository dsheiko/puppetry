import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { truncate, normalizeAssertionVerb } from "service/utils";
export const assertHtml = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( await ${ command.target }() ).getProp( "innerHTML" )`,
    command,
    `// Asserting that HTML content of the focused element satisfies the given constraint`
  ),

  toLabel: ({ assert }) => {
    return assert.value ? `(${ normalizeAssertionVerb( assert.assertion ) } \`${ truncate( assert.value, 80 ) }\`)`
      : "";
  },
  toText: ({ assert }) => {
    return assert.value ? `(${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\`)` : "";
  },
  commonly: "assert HTML",

  description: `Asserts that the HTML content of the focused element satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [

  ]
};
