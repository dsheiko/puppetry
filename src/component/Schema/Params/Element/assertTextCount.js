import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";

export const assertTextCount = {
  template: ( command ) => buildAssertionTpl(
    `( await ( await ${ command.target }() )`
    + `.$x( \`//*[contains(text(), ${ JSON.stringify( command.params.text ) })]\`) ).length`,
    command,
    `// Asserting that number of child elements containing a specified text satisfies the given constraint`
  ),
  assert: {
    node: AssertNumber
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
