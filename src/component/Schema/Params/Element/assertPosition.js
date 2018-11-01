import { buildAssertionTpl } from "service/assert";
import { AssertPosition } from "../../Assert/AssertPosition";

export const assertPosition = {
  template: ( command ) => buildAssertionTpl(
    `{
        target: await ( await ${ command.target }() ).boundingBox(),
        counterpart: await ( await ${ command.assert.target }() ).boundingBox()
      }`,
    command,
    `// Asserting that the bounding box of the element satisfies the given constraint`
  ),
  description: `Retrieves the bounding box of the
  element (relative to the main frame), or null if the element is not visible`,
  assert: {
    node: AssertPosition
  },
  params: [

  ]
};
