import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertAttribute } from "../../Assert/AssertAttribute";
import { normalizeAssertionVerb, normalizeAssertionValue, renderTarget } from "service/utils";

export const assertAttribute = {
  template: ( command ) => buildAssertionTpl(
    ( command.assert && [ "hasAttribute", "!hasAttribute" ].includes( command.assert.assertion )
      ? `await bs.target( ${ renderTarget( command.target ) } ).hasAttr( "${ command.params.name }" )`
      : `await bs.target( ${ renderTarget( command.target ) } ).getAttr( "${ command.params.name }" )` ),
    command,
    `// Asserting that "${ command.params.name }" `
      + `attribute's value of ${ command.target } satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) => `(\`${ params.name }\``
    + ` ${ normalizeAssertionVerb( assert.assertion ) }${ normalizeAssertionValue( assert )})`,

  toGherkin: ({ target, params, assert }) => `Assert that attribute \`${ params.name }\` of \`${ target }\`
    ${ normalizeAssertionVerb( assert.assertion ) }${ normalizeAssertionValue( assert )}`,

  commonly: "assert attribute",


  assert: {
    node: AssertAttribute,
    options: {
      type: "attribute"
    }
  },
  description: `Asserts that the
  specified [attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
  of \`{target}\` target  satisfies the given constraint`,
  params: [
    {

      fields: [
        {
          name: "params.name",
          control: INPUT,
          label: "Attribute name",
          description: `HTML attribute. E.g. for \`<a href="" data-foo=""></a>\`
          you can obtain \`href\` or \`data-foo\`.
[See here for details](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)`,
          placeholder: "e.g. href",
          initialValue: "",
          rules: [{
            required: true,
            message: "Attribute name required"
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
        "name": "href"
      }
    }
  ]
};
