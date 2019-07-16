import { buildAssertionTpl } from "service/assert";
import { AssertBoundingBox } from "../../Assert/AssertBoundingBox";
import { OPERATOR_MAP } from "service/utils";

export const assertBoundingBox = {
  template: ( command ) => buildAssertionTpl(
    `await ( await ${ command.target }() ).boundingBox()`,
    command,
    `// Asserting that the bounding box of the element satisfies the given constraint`
  ),

  toLabel: ({ assert }) => {
    return `(x ${ OPERATOR_MAP[ assert.xOperator ] } ${ assert.xValue }, `
              + `y ${ OPERATOR_MAP[ assert.yOperator ] } ${ assert.yValue }, `
              + `w ${ OPERATOR_MAP[ assert.wOperator ] } ${ assert.wValue }, `
              + `h ${ OPERATOR_MAP[ assert.hOperator ] } ${ assert.hValue })`;
  },
  commonly: "assert size/position",

  description: `Asserts that the
  [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
  (size and position) of \`{target}\` target satisfies the given constraint`,

  assert: {
    node: AssertBoundingBox
  },
  params: [

  ]
};
