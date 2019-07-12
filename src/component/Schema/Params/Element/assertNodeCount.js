import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";

export const assertNodeCount = {
  template: ( command ) => buildAssertionTpl(
    `( await ( await ${ command.target }() ).$$(${ JSON.stringify( command.params.selector ) }) ).length`,
    command,
    `// Asserting that number of child elements matching "${ command.params.selector }" satisfies the given constraint`
  ),
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
