import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { truncate, normalizeAssertionVerb, renderTarget } from "service/utils";

export const assertAttribute = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( ${ renderTarget( command.target ) } ).getAttr( "${ command.params.name }" )`,
    command,
    `// Asserting that "${ command.params.name }" `
      + `attribute's value of ${ command.target } satisfies the given constraint`
  ),

  toLabel: ({ params, assert }) => `(\`${ params.name }\``
    + ` ${ normalizeAssertionVerb( assert.assertion ) } \`${ truncate( assert.value, 60 ) }\`)`,
  toText: ({ params, assert }) => `(\`${ params.name }\``
    + ` ${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\`)`,

  toGherkin: ({ target, params, assert }) => `Assert attribute \`${ params.name }\` of \`${ target }\`
    ${ normalizeAssertionVerb( assert.assertion ) } \`${ assert.value }\``,

  commonly: "assert attribute",


  assert: {
    node: AssertValue,
    options: {
      boolean: true
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
          you can obtain href or \`data-foo\`.
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
  ]
};
