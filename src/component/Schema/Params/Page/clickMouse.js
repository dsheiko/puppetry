import { INPUT_NUMBER, SELECT } from "../../constants";
import { isEveryValueMissing } from "service/utils";

export const clickMouse = {
  template: ({ params }) => {
    const { x, y, button, clickCount, delay } = params,
          options = {
            button, clickCount, delay
          },
          optArg = isEveryValueMissing( options ) ? ` ` : `, ${ JSON.stringify( options ) } `;
    return `
      // Emulating mouse click at x=${ x }, y=${ y }
      await bs.page.mouse.click( ${ x }, ${ y }${ optArg });`;
  },

  description: `Emulates mouse click according to given options`,

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
            message: "Enter cursor X coordinate in pixels"
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
            message: "Enter cursor Y coordinate in pixels"
          }]
        }
      ]
    },

    {
      inline: true,
      legend: "Options",
      tooltip: "",
      items: [
        {
          name: "params.button",
          control: SELECT,
          label: "Button",
          tooltip: "",
          placeholder: "",
          initialValue: "left",
          options: [
            "left", "right", "middle"
          ],
          rules: [{
            required: true,
            message: "Select button"
          }]
        },
        {
          name: "params.clickCount",
          control: INPUT_NUMBER,
          label: "clickCount",
          initialValue: 1,
          tooltip: "",
          placeholder: "",
          rules: []
        },
        {
          name: "params.delay",
          control: INPUT_NUMBER,
          label: "delay",
          initialValue: 0,
          tooltip: "",
          placeholder: "",
          rules: []
        }

      ]
    }
  ]
};
