import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertNumber } from "../../Assert/AssertNumber";
import { HAS_OPERATOR_MAP } from "service/utils";

export const assertNodeCount = {
  template: ( command ) => buildAssertionTpl(
    `( await bs.page.$$(${ JSON.stringify( command.params.selector ) }) ).length`,
    command,
    `// Asserting that number of elements matching "${ command.params.selector }" satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) =>
    `(has ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }\` elements matching \`${ params.selector }\`)`,

  toGherkin: ({ params, assert }) => `Assert that the page has ${ HAS_OPERATOR_MAP[ assert.operator ] } \`${ assert.value }\`
    elements matching \`${ params.selector }\` selector`,

  commonly: "assert count of elements",

  assert: {
    node: AssertNumber,
    options: {
      resultLabel: "Number is"
    }
  },
  description: `Asserts that number of elements matching a specified selector satisfies the given constraint`,
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
  ]
};
