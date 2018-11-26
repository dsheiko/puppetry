import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";

export const assertContent = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.content()`,
    command,
    `// Asserting that page HTML satisfies the given constraint`
  ),
  description: `Asserts that the page content (HTML) satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [

  ]
};
