import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";

export const assertUrl = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.url()`,
    command,
    `// Asserting that page URL satisfies the given constraint`
  ),
  description: `Asserts that the page URL satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [

  ]
};
