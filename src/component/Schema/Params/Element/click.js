import { INPUT_NUMBER, SELECT } from "../../constants";
import { isEveryValueMissing } from "service/utils";

export const click = {
  template: ({ target, params }) => {
    const { button, clickCount, delay } = params,
          options = {
            button, clickCount, delay
          },
          optArg = isEveryValueMissing( options ) ? ` ` : ` ${ JSON.stringify( options ) } `;
    return `
      // Emulating mouse click
      await ( await ${target}() ).click(${optArg});`;
  },
  description: `Emulates mouse click on the element`,
  params: [

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
