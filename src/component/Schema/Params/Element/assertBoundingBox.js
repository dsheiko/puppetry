import { buildAssertionTpl } from "service/assert";
import { AssertBoundingBox } from "../../Assert/AssertBoundingBox";

export const assertBoundingBox = {
  template: ( command ) => buildAssertionTpl(
    `await ( await ${ command.target }() ).boundingBox()`,
    command,
    `// Asserting that the bounding box of the element satisfies the given constraint`
  ),
  description: `Asserts that the
  [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
  (size and position) of {target} target satisfies the given constraint`,

  assert: {
    node: AssertBoundingBox
  },
  params: [

  ]
};
