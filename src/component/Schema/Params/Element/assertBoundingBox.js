import { buildAssertionTpl } from "service/assert";
import { AssertBoundingBox } from "../../Assert/AssertBoundingBox";

export const assertBoundingBox = {
  template: ( command ) => buildAssertionTpl(
    `await ( await ${ command.target }() ).boundingBox()`,
    command,
    `// Asserting that the bounding box of the element satisfies the given constraint`
  ),
  description: `Retrieves the bounding box of the
  element (relative to the main frame), or null if the element is not visible`,
  assert: {
    node: AssertBoundingBox
  },
  params: [

  ]
};
