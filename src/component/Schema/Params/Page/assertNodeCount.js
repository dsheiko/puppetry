import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";

export const assertNodeCount = {
  template: ( command ) => buildAssertionTpl(
    `( await bs.page.$$("${ command.params.selector }") ).length`,
    command,
    `// Asserting that number of elements matching "${ command.params.selector }" satisfies the given constraint`
  ),
  assert: {
    node: AssertNumber
  },
  description: `Asserts that number of elements matching a specified selector satisfies the given constraint`,
  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      items: [
        {
          name: "params.selector",
          control: INPUT,
          label: "Selector",
          tooltip: ``,
          placeholder: "",
          rules: [{
            required: true,
            message: "Enter selector"
          }]
        }
      ]
    }
  ]
};
