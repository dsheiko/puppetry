import { INPUT_NUMBER } from "../../constants";

export const moveMouse = {
  template: ({ params }) => {
    const { x, y } = params;
    return `
      // Move mouse at x=${ x }, y=${ y }
      await bs.page.mouse.move( ${ x }, ${ y } );`;
  },

  description: `Move mouse to given position`,

  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      items: [
        {
          name: "params.x",
          control: INPUT_NUMBER,
          label: "x (px)",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: "Enter cursor X coordinate in pixels"
          }]
        },
        {
          name: "params.y",
          control: INPUT_NUMBER,
          label: "y (px)",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: "Enter cursor Y coordinate in pixels"
          }]
        }
      ]
    }
  ]
};
