import { SELECT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";
import { OPERATOR_MAP } from "service/utils";

export const assertScroll = {
  template: ( command ) => buildAssertionTpl(
    `await ( await bs.page.evaluate(`
    + ` () => window.${ command.params.direction === "horizontally" ? "scrollX" : "scrollY" } ) )`,
    command,
    `// Asserting that window scroll offset satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) => {
    return params.direction === "horizontally"
      ? `(x ${ OPERATOR_MAP[ assert.operator ] }  ${ assert.value })`
      : `(y ${ OPERATOR_MAP[ assert.operator ] }  ${ assert.value })`;
  },
  commonly: "assert window scroll offset",

  description: `Asserts that [window scroll](https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll)
 offset satisfies the given constraint`,
  assert: {
    node: AssertNumber
  },
  params: [
    {
      fields: [
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
