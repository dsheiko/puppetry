import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";

export const assertHtml = {
  template: ( command ) => buildAssertionTpl(
    `await ( await ${ command.target }() ).getProp( "innerHTML" )`,
    command,
    `// Asserting that HTML content of the focused element satisfies the given constraint`
  ),
  description: `Retrieves HTML content of the focused element`,
  assert: {
    node: AssertValue
  },
  params: [

  ]
};
