import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";


export const assertAttribute = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( await ${ command.target }() ).getAttr( "${ command.params.name }" )`,
    command,
    `// Asserting that "${ command.params.name }" `
      + `attribute's value of ${ command.target } satisfies the given constraint`
  ),
  assert: {
    node: AssertValue
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
