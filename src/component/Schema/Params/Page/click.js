import { INPUT_NUMBER, SELECT } from "../../constants";
import { isEveryValueMissing } from "service/utils";

export const click = {
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
        },
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
          tooltip: "Set 2 for double click",
          placeholder: "",
          rules: []
        },
        {
          name: "params.delay",
          control: INPUT_NUMBER,
          label: "delay (ms)",
          initialValue: 0,
          tooltip: "Time to wait between mousedown (pointing device button is pressed) "
            + "and mouseup (pointing device button is released) in milliseconds.",
          placeholder: "",
          rules: []
        }
      ]
    }
  ]
};
