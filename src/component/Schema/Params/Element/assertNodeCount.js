import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";
import { HAS_OPERATOR_MAP, renderTarget } from "service/utils";

export const assertNodeCount = {
  template: ( command ) => buildAssertionTpl(
    `( await ( ${ renderTarget( command.target ) } ).$$(${ JSON.stringify( command.params.selector ) }) ).length`,
    command,
    `// Asserting that number of child elements matching "${ command.params.selector }" satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) =>
    `(has ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value } \` elements matching \`${ params.selector }\`)`,

  toGherkin: ({ target, params, assert }) => `Assert that target \`${ target }\`
    has ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }\`
    nested elements matching \`${ params.selector }\``,

  commonly: "assert count of child elements",

  assert: {
    node: AssertNumber,
    options: {
      resultLabel: "Number is"
    }
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
  ],

  testTypes: {
    "assert": {
      "operator": "SELECT",
      "value": "INPUT_NUMBER"
    },
    "params": {
      "selector": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "number",
        "operator": "gt",
        "value": 0
      },
      "params": {
        "selector": "div"
      }
    }
  ]
};
