import { TEXTAREA } from "../../constants";
import { justify } from "service/assert";
import { truncate } from "service/utils";

export const evaluate = {
  template: ({ params }) => {
    const { value } = params;
    return justify( `
// Evaluate JavaScript code in the page context
await bs.page.evaluate(() => {
  ${ value }
});` );
  },

  toLabel: ({ params }) => `(\`${ truncate( params.value, 80 ) }\`)`,
  toText: ({ params }) => `(\`${ params.value }\`)`,
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
