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
  description: `Asserts {target} target's position relative to other given target`,
  assert: {
    node: AssertPosition
  },
  params: [

  ]
};
