import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";

export const assertHtml = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( await ${ command.target }() ).getProp( "innerHTML" )`,
    command,
    `// Asserting that HTML content of the focused element satisfies the given constraint`
  ),
  description: `Asserts that the HTML content of the focused element satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [

  ]
};
