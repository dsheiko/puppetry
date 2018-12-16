import { TEXTAREA } from "../../constants";
import { justify } from "service/assert";

export const evaluate = {
  template: ({ params }) => {
    const { value } = params;
    return justify( `
// Evaluate JavaScript code in the page context
await bs.page.evaluate(() => {
  ${ value }
});` );
  },
  description: `Evaluate JavaScript code in the page context`,
  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      items: [
        {
          name: "params.value",
          control: TEXTAREA,
          label: "JavaScript code to inject",
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
