import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertTrue } from "../../Assert/AssertTrue";

export const assertContainsClass = {
  template: ( command ) => buildAssertionTpl(
    `await bs.page.$eval( '${ command.targetSeletor }',
  ( el, className ) => el.classList.contains( className ), `
    + `"${ command.params.name }" )`,
    command,
    `// Asserting that "${ command.params.name }" CSS class `
      + `value exists in ${ command.target } class attribute`
  ),
  assert: {
    node: AssertTrue
  },
  description: `Asserts that the specified class value exists in the element's
(https://developer.mozilla.org/en-US/docs/Web/API/Element) class attribute.`,
  params: [
    {
      inline: false,
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
  ]
};
