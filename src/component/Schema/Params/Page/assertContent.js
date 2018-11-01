import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";

export const assertContent = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.content()`,
    command,
    `// Asserting that page HTML satisfies the given constraint`
  ),
  description: `Retrieves the full HTML contents of the page, including the doctype`,
  assert: {
    node: AssertValue
  },
  params: [

  ]
};
