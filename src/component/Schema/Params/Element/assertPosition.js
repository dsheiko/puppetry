import { buildAssertionTpl } from "service/assert";
import { AssertPosition } from "../../Assert/AssertPosition";
import { renderTarget } from "service/utils";

function assertToLabel( assert ) {
  const text = [ "left", "right" ].includes( assert.position )
    ? assert.position + " to" : assert.position;
  return `${ text } \`${ assert.target }\``;
}

export const assertPosition = {
  template: ( command ) => buildAssertionTpl(
    `{
        target: await ( ${ renderTarget( command.target ) } ).boundingBox(),
        counterpart: await ( ${ renderTarget( command.assert.target ) } ).boundingBox()
      }`,
    command,
    `// Asserting that the bounding box of the element satisfies the given constraint`
  ),

  toLabel: ({ assert }) => `(is ${ assertToLabel( assert ) })`,

  toGherkin: ({ target, assert }) => `Assert that element \`${ target }\`
    is located ${ assertToLabel( assert ) }`,

  commonly: "assert relative position",


  description: `Asserts \`{target}\` target's position relative to other given target`,
  assert: {
    node: AssertPosition
  },
  params: [

  ],

  testTypes: {
    "assert": {
      "position": "SELECT",
      "target": "SELECT"
    }
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "position",
        "position": "above",
        "target": "TODO_INPUT"
      }
    }
  ]
};
