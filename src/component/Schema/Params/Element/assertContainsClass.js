import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertBoolean } from "../../Assert/AssertBoolean";

export const assertContainsClass = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.$eval( '${ command.targetSeletor }',
  ( el, className ) => el.classList.contains( className ), `
    + `"${ command.params.name }" )`,
    command,
    `// Asserting that "${ command.params.name }" CSS class `
      + `value exists in ${ command.target } class attribute`
  ),

  toLabel: ({ params, assert }) => `(${ assert.value ? "contains": "does not contain" } \`${ params.name }\`)`,

  toGherkin: ({ target, params, assert }) => `Assert that \`${ target }\`
    ${ assert.value ? "contains": "does not contain" } \`${ params.name }\` class`,

  commonly: "assert: it contains class",

  assert: {
    node: AssertBoolean,
    options: {
      textNode: "contains class"
    }
  },
  description: `Asserts that the specified class value exists in the [element's
 class attribute](https://developer.mozilla.org/en-US/docs/Web/API/Element).`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.name",
          control: INPUT,
          label: "CSS class name",
          tooltip: "",
          placeholder: "e.g. .has-error",
          initialValue: "",
          rules: [{
            required: true,
            message: "Class name required"
          },
          {
            transform: ( value ) => value.trim()
          }]
        }
      ]
    }
  ],

  testTypes: {
    "assert": {
      "value": "CHECKBOX"
    },
    "params": {
      "name": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "boolean",
        "value": true
      },
      "params": {
        "name": ".foo"
      }
    }
  ]
};
