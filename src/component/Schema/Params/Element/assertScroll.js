import { SELECT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";
import { HAS_OPERATOR_MAP } from "service/utils";

export const assertScroll = {
  template: ( command ) => buildAssertionTpl(
    `await ( await bs.page.$eval( '${ command.targetSeletor }', `
    + ` ( el ) => el.${ command.params.direction === "horizontally" ? "scrollLeft" : "scrollTop" } ) )`,
    command,
    `// Asserting that scroll offset on ${ command.target } `
      + `satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) =>
    `(\`${ params.direction }\` by ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }px\`)`,

  toGherkin: ({ target, params, assert }) => `Assert that element \`${ target }\`
    is scrolled \`${ params.direction }\` by ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }px\``,

  commonly: "assert scroll offset",

  description: `Asserts that [scroll](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop)
offset on the target satisfies the given constraint`,
  assert: {
    node: AssertNumber,
    options: {
      resultLabel: "Offset is"
    }
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
