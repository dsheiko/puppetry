import { justify } from "service/assert";
import { SELECT, INPUT } from "../../constants";

export const toggleClass = {
  template: ( command ) => justify(
    `// Toggle class value\n`
    + `await bs.page.$eval( '${ command.targetSeletor }',
  ( el, className, toggle ) => el.classList.toggle( className, toggle ), `
    + `"${ command.params.name }", ${ command.params.toggle ? "true" : "false" } )` ),

  toLabel: ({ params }) => `(${ params.toggle } \`${ params.name }\`)`,
  toGherkin: ({ target, params }) => `${ params.toggle ? "Add" : "Remove" }
    class \`${ params.name }\` to element \`${ target }\``,
  commonly: "toggle class",

  description: `Toggles the specified class value (adds or removes)`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.name",
          control: INPUT,
          label: "CSS class value",
          help: "",
          placeholder: "e.g. .has-error",
          initialValue: "",
          rules: [{
            required: true,
            message: "Class value required"
          }]
        },
        {
          name: "params.toggle",
          control: SELECT,
          inputStyle: { maxWidth: 200 },
          label: "Action",
          tooltip: "",
          placeholder: "",
          initialValue: "add",
          options: [
            "add", "remove"
          ]
        }
      ]
    }
  ],

  test: [
    {
      valid: true,
      "params": {
        "name": ".foo",
        "toggle": "add"
      }
    }
  ]
};
