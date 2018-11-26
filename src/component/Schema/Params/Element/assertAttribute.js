import React from "react";
import { INPUT } from "../../constants";
import { onExtClick } from "service/utils";
import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";


export const assertAttribute = {
  template: ( command ) => buildAssertionTpl(
    `await ( await ${ command.target }() ).getAttr( "${ command.params.name }" )`,
    command,
    `// Asserting that "${ command.params.name }" `
      + `attribute's value of ${ command.target } satisfies the given constraint`
  ),
  assert: {
    node: AssertValue
  },
  description: `Asserts that the
  specified [attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
  of {target} target  satisfies the given constraint`,
  params: [
    {
      inline: false,
      legend: "",
      tooltip: "",
      items: [
        {
          name: "params.name",
          control: INPUT,
          label: "Attribute name",
          help: ( <span>HTML attribute. E.g. for { `<a href="" data-foo=""></a>` } you can obtain href or data-foo.
            { " " } <a onClick={ onExtClick } href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes">
                See here for details</a></span> ),
          placeholder: "e.g. href",
          initialValue: "",
          rules: [{
            required: true,
            message: "Attributre name required"
          },
          {
            transform: ( value ) => value.trim()
          }]
        }
      ]
    }
  ]
};
