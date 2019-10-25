import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";
import { HAS_OPERATOR_MAP, renderTarget } from "service/utils";

export const assertTextCount = {
  template: ( command ) => buildAssertionTpl(
    `( await ( ${ renderTarget( command.target ) } )`
    + `.$x( \`//*[contains(text(), ${ JSON.stringify( command.params.text ) })]\`) ).length`,
    command,
    `// Asserting that number of child elements containing a specified text satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) =>
    `(has ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }\` child elements with \`${ params.text }\`)`,

  toGherkin: ({ target, params, assert }) => `Assert that element \`${ target }\` has
   ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }\` child elements containing \`${ params.text }\``,

  commonly: "assert count of elements with text",

  assert: {
    node: AssertNumber,
    options: {
      resultLabel: "Number is"
    }
  },
  description: `Asserts that number of child elements containing a specified text satisfies the given constraint`,
  params: [
    {
      fields: [
        {
          name: "params.text",
          control: INPUT,
          label: "Text",
          placeholder: "Submit",
          rules: [{
            required: true,
            message: "Enter text"
          }]
        }
      ]
    }
  ],

  testTypes: {
    "assert": {
      "assertion": "SELECT",
      "operator": "SELECT",
      "value": "INPUT_NUMBER"
    },
    "params": {
      "text": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "number",
        "operator": "eq",
        "value": 0
      },
      "params": {
        "text": "ipsum"
      }
    }
  ]
};
