import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";
import { OPERATOR_MAP } from "service/utils";

export const assertNodeCount = {
  template: ( command ) => buildAssertionTpl(
    `( await ( await ${ command.target }() ).$$(${ JSON.stringify( command.params.selector ) }) ).length`,
    command,
    `// Asserting that number of child elements matching "${ command.params.selector }" satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) =>
    `(count(\`${ params.selector }\`) ${ OPERATOR_MAP[ assert.operator ] } ${ assert.value })`,
  commonly: "assert count of child elements",

  assert: {
    node: AssertNumber
  },
  description: `Asserts that number of child elements matching a specified selector satisfies the given constraint`,
  params: [
    {
      fields: [
        {
          name: "params.selector",
          control: INPUT,
          label: "Selector",
          placeholder: "e.g div",
          rules: [{
            required: true,
            message: "Enter CSS selector"
          }]
        }
      ]
    }
  ]
};
