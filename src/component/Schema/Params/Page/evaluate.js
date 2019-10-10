import { TEXTAREA } from "../../constants";
import { justify } from "service/assert";
import { truncate } from "service/utils";

function sanitize( val ) {
  return truncate( val.replace( /\"/m, "" ), 60 );
}

export const evaluate = {
  template: ({ params }) => {
    const { value } = params;
    return justify( `
// Evaluate JavaScript code in the page context
await bs.page.evaluate(() => {
  ${ value }
});` );
  },

  toLabel: ({ params }) => `(\`${ sanitize( params.value ) }\`)`,
  toGherkin: ({ params }) => `Evaluate JavaScript in the page context: \`${ sanitize( params.value ) }\``,
  commonly: "evaluate JavaScript in the page context",


  test: {
    "params": {
      "value": "FOO"
    }
  },

  description: `Evaluates JavaScript code in the page context`,
  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          control: TEXTAREA,
          label: "JavaScript",
          initialValue: "",
          placeholder: `document.body.classList.add( "foo" );`,
          rules: [{
            required: true,
            message: "Code is required"
          }]
        }

      ]
    }
  ]
};
