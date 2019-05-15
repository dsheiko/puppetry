import { buildAssertionTpl } from "service/assert";
import { AssertBoolean } from "../../Assert/AssertBoolean";

export const assertVisible = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( await ${ command.target }() ).isVisible()`,
    command,
    `// Asserting that ${ command.target } element is visible`
  ),
  assert: {
    node: AssertBoolean
  },
  description: `Tests whether this element is currently displayed`,
  params: [
  ]
};
