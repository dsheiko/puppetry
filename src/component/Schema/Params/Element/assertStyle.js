import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";

export const assertStyle = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.$eval( '${ command.targetSeletor }',
  ( el, prop, pseudoEl ) => window.getComputedStyle( el, pseudoEl || null )
  .getPropertyValue( prop ), "${ command.params.name }", "${ command.params.pseudo }" )`,
    command,
    `// Asserting that "${ command.params.name }" CSS property's `
      + `value of ${ command.target } satisfies the given constraint`
  ),
  assert: {
    node: AssertValue
  },
  description: `Asserts that the computed style
  (https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)
  of {target} target matches the given value`,
  params: [
    {
      inline: false,
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.name",
          control: INPUT,
          label: "Style property",
          tooltip: "",
          placeholder: "e.g. border-left-color",
          initialValue: "",
          rules: [{
            required: true,
            message: "Property required"
          },
          {
            transform: ( value ) => value.trim()
          }]
        },
        {
          name: "params.pseudo",
          control: INPUT,
          label: "Pseudo-selector",
          tooltip: "Leave empty if you asserting on element",
          placeholder: "e.g. :before"
        }
      ]
    }
  ]
};
