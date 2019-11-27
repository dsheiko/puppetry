import { justify } from "service/assert";
import { SELECT } from "../../constants";

export const checkBox = {
  template: ({ params, targetSeletor }) => justify(
    `// Changing checkbox/radio state\n`
    + `await bs.page.$eval( '${ targetSeletor }',
  ( el, value ) => {
    if ( value === "false" ) {
      return el.removeAttribute( "checked" );
    }
    el.setAttribute( "checked", value );
    }, `
    + `"${ params.checked }" );` ),

  toLabel: ({ params }) => `(\`${ params.checked === "true" ? "checked" : "unchecked" }\`)`,
  toGherkin: ({ target, params }) => `Set checkbox \`${ target }\` ${ params.checked === "true" ? "on" : "off" }`,

  commonly: "toggle checkbox/radio",

  description: `Toggles checkbox/radio state`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.checked",
          control: SELECT,
          inputStyle: { maxWidth: 128 },
          options: [
            {
              value: "true",
              description: "is checked"
            },
            {
              value: "false",
              description: "is unchecked"
            }
          ],
          label: "State",
          help: "",
          initialValue: "false"
        }
      ]
    }
  ],

  testTypes: {
    "params": {
      "checked": "CHECKBOX"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "checked": "true"
      }
    }
  ]
};
