import { justify } from "service/assert";
import { INPUT } from "../../constants";

export const setAttribute = {
  template: ( command ) => justify(
    `// Set the value of an attribute on the specified element.\n`
    + `await bs.page.$eval( '${ command.targetSeletor }',
  ( el, prop, value ) => {
    if ( value === "false" ) {
      return el.removeAttribute( prop );
    }
    el.setAttribute( prop, value );
  }, `
    + `"${ command.params.name }", "${ command.params.value }" );` ),

  toLabel: ({ params }) => `(\`${ params.name }\`, \`${ params.value }\`)`,
  toGherkin: ({ target, params }) => `Set value \`${ params.value }\`
  of attribute \`${ params.name }\` on \`${ target }\``,
  commonly: "set attribute",

  description: `Sets the value of an [attribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute)`
    + ` on \`{target}\` target`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.name",
          control: INPUT,
          label: "Element attribute",
          help: "",
          placeholder: "e.g. checked",
          initialValue: "",
          rules: [{
            required: true,
            message: "Property required"
          }]
        },
        {
          name: "params.value",
          control: INPUT,
          label: "Value",
          tooltip: "If you want to remove the attribute, give it 'false' value",
          placeholder: "e.g. true"
        }
      ]
    }
  ],

  test: [
    {
      valid: true,
      "params": {
        "name": "checked",
        "value": "true"
      }
    }
  ]
};
