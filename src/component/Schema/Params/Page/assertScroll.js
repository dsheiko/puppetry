import { SELECT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";
import { HAS_OPERATOR_MAP } from "service/utils";

export const assertScroll = {
  template: ( command ) => buildAssertionTpl(
    `await ( await bs.page.evaluate(`
    + ` () => window.${ command.params.direction === "horizontally" ? "scrollX" : "scrollY" } ) )`,
    command,
    `// Asserting that window scroll offset satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) =>
    `(\`${ params.direction }\` by ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }px\`)`,

  toGherkin: ({ params, assert }) => `Assert that page
    is scrolled \`${ params.direction }\` by ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }px\``,

  commonly: "assert window scroll offset",

  description: `Asserts that [window scroll](https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll)
 offset satisfies the given constraint`,
  assert: {
    node: AssertNumber,
    options: {
      resultLabel: "Offset is"
    }
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
  ],

  testTypes: {
    "assert": {
      "operator": "SELECT",
      "value": "INPUT_NUMBER"
    },
    "params": {
      "direction": "SELECT"
    }
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "number",
        "operator": "gt",
        "value": -1
      },
      "params": {
        "direction": "horizontally"
      }
    }
  ]
};
