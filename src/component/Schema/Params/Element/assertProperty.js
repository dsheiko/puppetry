import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { truncate, normalizeAssertionVerb, renderTarget } from "service/utils";

export const assertProperty = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( ${ renderTarget( command.target ) } ).getProp( "${ command.params.name }" )`,
    command,
    `// Asserting that "${ command.params.name }" property's `
      + `value of ${ command.target } satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) => `(\`${ params.name }\``
    + ` ${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\`)`,

  toGherkin: ({ target, params, assert }) => `Assert that \`${ params.name }\` property of \`${ target }\`
    ${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\``,

  commonly: "assert property",

  assert: {
    node: AssertValue,
    options: {
      boolean: true
    }
  },
  description: `Asserts that the
  specified [property](https://developer.mozilla.org/en-US/docs/Web/API/Element)
  of \`{target}\` target  satisfies the given constraint`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.name",
          control: INPUT,
          label: "Property name",
          tooltip: "",
          placeholder: "e.g. checked",
          initialValue: "",
          rules: [{
            required: true,
            message: "Property name required"
          },
          {
            transform: ( value ) => value.trim()
          }]
        }
      ]
    }
  ],

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "!equals",
        "type": "string",
        "value": "aaa"
      },
      "params": {
        "name": "checked"
      }
    }
  ]
};
