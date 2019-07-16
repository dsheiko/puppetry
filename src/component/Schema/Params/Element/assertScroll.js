import { SELECT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";
import { OPERATOR_MAP } from "service/utils";

export const assertScroll = {
  template: ( command ) => buildAssertionTpl(
    `await ( await bs.page.$eval( '${ command.targetSeletor }', `
    + ` ( el ) => el.${ command.params.direction === "horizontally" ? "scrollLeft" : "scrollTop" } ) )`,
    command,
    `// Asserting that scroll offset on ${ command.target } `
      + `satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) => {
    return params.direction === "horizontally"
      ? `(x ${ OPERATOR_MAP[ assert.operator ] }  ${ assert.value })`
      : `(y ${ OPERATOR_MAP[ assert.operator ] }  ${ assert.value })`;
  },
  commonly: "assert scroll offset",

  description: `Asserts that [scroll](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop)
offset on the target satisfies the given constraint`,
  assert: {
    node: AssertNumber
  },
  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
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
