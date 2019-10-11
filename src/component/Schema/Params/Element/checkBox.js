import { justify } from "service/assert";
import { CHECKBOX } from "../../constants";

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

  toLabel: ({ params }) => `(\`${ params.checked ? "checked" : "unchecked" }\`)`,
  toGherkin: ({ target, params }) => `Set checkbox \`${ target }\` ${ params.checked ? "on" : "off" }`,

  commonly: "toggle checkbox/radio",

  description: `Toggles checkbox/radio state`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.checked",
          control: CHECKBOX,
          label: "is checked",
          help: "",
          initialValue: "false"
        }
      ]
    }
  ],

  test: [
    {
      valid: true,
      "params": {
        "checked": true
      }
    }
  ]
};
