import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";
import { OPERATOR_MAP, command } from "service/utils";

export const assertTextCount = {
  template: ( command ) => buildAssertionTpl(
    `( await ( ${ renderTarget( command.target ) } )`
    + `.$x( \`//*[contains(text(), ${ JSON.stringify( command.params.text ) })]\`) ).length`,
    command,
    `// Asserting that number of child elements containing a specified text satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) =>
    `(count(\`${ params.text }\`) ${ OPERATOR_MAP[ assert.operator ] } ${ assert.value })`,
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
  ]
};
