import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";
import { HAS_OPERATOR_MAP, renderTarget } from "service/utils";
import ExpressionParser from "service/ExpressionParser";

export const assertTextCount = {
  template: ( command ) => { 
    const parser = new ExpressionParser( command.id );
    return buildAssertionTpl(
      `( await ( ${ renderTarget( command.target ) } )`
      + `.$x( \`//*[contains(text(), \${ JSON.stringify( assert ) })]\`) ).length`,
      command,
      `// Asserting that number of child elements containing a specified text satisfies the given constraint
assert = ${ parser.stringify( command.params.text ) };`
    );
  },

  toLabel: ({ params, assert }) =>
    `(has ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }\` child elements with \`${ params.text }\`)`,

  toGherkin: ({ target, params, assert }) => `Assert that target \`${ target }\` has
   ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }\` child elements containing \`${ params.text }\``,

  commonly: "assert count of elements with text",

  assert: {
    node: AssertNumber,
    options: {
      resultLabel: "Number is"
    }
  },
  description: `Asserts that number of child elements containing a specified text satisfies the given constraint.` + 
    `Text may container template expressions.`,
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
