import { INPUT_NUMBER, SELECT } from "../../constants";
import { isEveryValueMissing } from "service/utils";

export const tapTouchscreen = {
  template: ({ params }) => {
    const { x, y } = params;
    return `
      // Emulating tap at x=${ x }, y=${ y }
      await bs.page.touchscreen.tap( ${ x }, ${ y });`;
  },

  description: `Emulates tap according to given options`,

  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      items: [
        {
          name: "params.x",
          control: INPUT_NUMBER,
          label: "x",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: "Enter X coordinate in pixels"
          }]
        },
        {
          name: "params.y",
          control: INPUT_NUMBER,
          label: "y",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: "Enter Y coordinate in pixels"
          }]
        }
      ]
    }

  ]
};
