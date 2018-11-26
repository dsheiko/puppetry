import { SELECT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";

export const assertScroll = {
  template: ( command ) => buildAssertionTpl(
    `await ( await bs.page.evaluate(`
    + ` () => window.${ command.params.direction === "horizontally" ? "scrollX" : "scrollY" } ) )`,
    command,
    `// Asserting that window scroll offset satisfies the given constraint`
  ),
  description: `Asserts that [window scroll](https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll)
 offset satisfies the given constraint`,
  assert: {
    node: AssertNumber
  },
  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      items: [
        {
          name: "params.direction",
          control: SELECT,
          label: "Direction",
          initialValue: "horizontally",
          options: [
            "horizontally", "vertically"
          ],
          rules: [{
            required: true,
            message: "Parameter is required"
          }]
        }

      ]
    }
  ]
};
