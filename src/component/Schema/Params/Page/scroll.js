import { INPUT_NUMBER } from "../../constants";
import { justify } from "service/assert";

export const scroll = {
  template: ({ params }) => {
    const { x, y } = params;
    return justify( `
// Scrolls the document in the window by the given amount.
await bs.page.evaluate(( x, y ) => {
  window.scrollBy( x, y );
}, ${ parseInt( x, 10 ) }, ${ parseInt( y, 10 ) });` );
  },

  toLabel: ({ params }) => `(x: ${ params.x }, y: ${ params.y })`,
  commonly: "",


  description: `Scrolls the document in the window by the given amount`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.x",
          control: INPUT_NUMBER,
          label: "x-coordinate (px)",
          initialValue: 0,
          tooltip: `Set the horizontal pixel value that you want to scroll by`,
          placeholder: "e.g. 0",
          rules: [{
            required: true,
            message: "X-coordinate is required"
          }]
        },
        {
          name: "params.y",
          control: INPUT_NUMBER,
          label: "y-coordinate (px)",
          initialValue: 0,
          tooltip: `Set the vertical pixel value that you want to scroll by`,
          placeholder: "e.g. 0",
          rules: [{
            required: true,
            message: "Y-coordinate is required"
          }]
        }

      ]
    }
  ]
};
