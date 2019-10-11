import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { INPUT } from "../../constants";
import { truncate, normalizeAssertionVerb } from "service/utils";

export const assertVar = {
  template: ( command ) => buildAssertionTpl(
    `ENV[ ${ JSON.stringify( command.params.name ) } ]`,
    command,
    `// Asserting that variable associated with a given name satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) => `(\`${ params.name }\` ${ normalizeAssertionVerb( assert.assertion ) } \`${  assert.value }\`)`,
  toGherkin: ({ params, assert }) => `Assert that template variable \`${ params.name }\`
   ${ normalizeAssertionVerb( assert.assertion ) } \`${  assert.value }\``,

  commonly: "assert template variable value",

  description: `Asserts that variable associated with a given name satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [
    {
      legend: "",
      description: "",
      tooltip: "",
      fields: [
        {
          name: "params.name",
          control: INPUT,
          label: "Variable name",
          rules: [{
            required: true,
            message: "This field is required"
          },
          {
            validator: ( rule, value, callback ) => {
              const reConst = /^[A-Z_\-0-9]+$/g;
              if ( !value ) {
                callback( `Field is required.` );
              }
              if ( !value.match( reConst ) ) {
                callback( `Shall be in all upper case with underscore separators` );
              }
              callback();
            }
          }
          ]
        }
      ]
    }
  ],

  test: [
    {
      valid: true,
       "assert": {
          "assertion": "equals",
          "type": "string",
          "value": "foo"
        },
        "params": {
          "name": "FOO"
        }
    }
  ]
};
