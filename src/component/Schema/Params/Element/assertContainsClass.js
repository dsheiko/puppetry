import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertContainsClass } from "../../Assert/AssertContainsClass";

export const assertContainsClass = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.$eval( '${ command.targetSeletor }',
  ( el, className ) => el.${ command.params.name.startsWith( ":" )
    ? "matches" : "classList.contains" }( className ), `
    + `"${ command.params.name }" )`,
    command,
    `// Asserting that "${ command.params.name }" CSS class `
      + `value exists in ${ command.target } class attribute`
  ),

  toLabel: ({ params, assert }) => `(${ assert.assertion === "hasClass"
    ? "contains": "does not contain" } \`${ params.name }\`)`,

  toGherkin: ({ target, params, assert }) => `Assert that \`${ target }\`
    ${ assert.assertion === "hasClass" ? "contains": "does not contain" } class \`${ params.name }\``,

  commonly: "assert: it contains class",

  assert: {
    node: AssertContainsClass,
    options: {
      textNode: "contains class"
    }
  },
  description: `Asserts that the specified class value exists in the [element's
 class attribute](https://developer.mozilla.org/en-US/docs/Web/API/Element).
  If a pseudo-class given (e.g. <code>:disabled</code>) we assert that the element matches the class`,
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
          placeholder: "e.g. .has-error or :disabled",
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
