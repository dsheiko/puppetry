import { buildAssertionTpl } from "service/assert";
import { AssertPosition } from "../../Assert/AssertPosition";
import { renderTarget } from "service/utils";

export const assertPosition = {
  template: ( command ) => buildAssertionTpl(
    `{
        target: await ( ${ renderTarget( command.target ) } ).boundingBox(),
        counterpart: await ( ${ renderTarget( command.assert.target ) } ).boundingBox()
      }`,
    command,
    `// Asserting that the bounding box of the element satisfies the given constraint`
  ),

  toLabel: ({ assert }) => {
    const text = [ "left", "right" ].includes( assert.position )
      ? assert.position + " to" : assert.position;
    return `(is ${ text } ${ assert.target })`;
  },
  commonly: "assert relative position",


  description: `Asserts \`{target}\` target's position relative to other given target`,
  assert: {
    node: AssertPosition
  },
  params: [

  ]
};
