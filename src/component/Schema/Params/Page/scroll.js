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

  toLabel: ({ params }) => `(x: \`${ params.x }px\`, y: \`${ params.y }px\`)`,
  toGherkin: ({ params }) => `Scroll the page by \`${ params.x }px\` horizontally and \`${ params.y }px\` vertically`,
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
          label: "x (px)",
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
          label: "y (px)",
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
  ],

  testTypes: {
    "params": {
      "x": "INPUT_NUMBER",
      "y": "INPUT_NUMBER"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "x": 1,
        "y": 1
      }
    }
  ]
};
