import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertProperty } from "../../Assert/AssertProperty";
import { normalizeAssertionVerb, normalizeAssertionValue, renderTarget } from "service/utils";

export const assertProperty = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( ${ renderTarget( command.target ) } ).getProp( "${ command.params.name }" )`,
    command,
    `// Asserting that "${ command.params.name }" property's `
      + `value of ${ command.target } satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) => `(\`${ params.name }\``
    + ` ${ normalizeAssertionVerb( assert.assertion ) }${ normalizeAssertionValue( assert.value )})`,

  toGherkin: ({ target, params, assert }) => `Assert that property \`${ params.name }\` of \`${ target }\`
    ${ normalizeAssertionVerb( assert.assertion ) }${ normalizeAssertionValue( assert )}`,

  commonly: "assert property",

  assert: {
    node: AssertProperty,
    options: {
      type: "property"
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

  testTypes: {
    "assert": {
      "assertion": "SELECT",
      "value": "INPUT"
    },
    "params": {
      "name": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "!equals",
        "type": "string",
        "value": "ipsum"
      },
      "params": {
        "name": "checked"
      }
    }
  ]
};
