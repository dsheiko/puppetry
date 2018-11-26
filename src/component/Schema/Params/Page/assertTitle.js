import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";

export const assertTitle = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.title()`,
    command,
    `// Asserting that page title satisfies the given constraint`
  ),
  description: `Asserts that the page title satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [

  ]
};
