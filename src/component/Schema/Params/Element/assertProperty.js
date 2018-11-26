import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";

export const assertProperty = {
  template: ( command ) => buildAssertionTpl(
    `await ( await ${ command.target }() ).getProp( "${ command.params.name }" )`,
    command,
    `// Asserting that "${ command.params.name }" property's `
      + `value of ${ command.target } satisfies the given constraint`
  ),
  assert: {
    node: AssertValue
  },
  description: `Asserts that the
  specified [property](https://developer.mozilla.org/en-US/docs/Web/API/Element)
  of {target} target  satisfies the given constraint`,
  params: [
    {
      inline: false,
      legend: "",
      tooltip: "",
      items: [
        {
          name: "params.name",
          control: INPUT,
          label: "Property name",
          tooltip: "",
          placeholder: "e.g. checked",
          initialValue: "",
          rules: [{
            required: true,
            message: "Property name required"
          },
          {
            transform: ( value ) => value.trim()
          }]
        }
      ]
    }
  ]
};
