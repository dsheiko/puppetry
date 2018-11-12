import { SELECT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";

export const reload = {
  template: ({ params }) => {
    const { timeout, waitUntil } = params,
          options = {
            timeout, waitUntil
          },
          optArg = isEveryValueMissing( options ) ? `` : ` ${ JSON.stringify( options ) } `;
    return `
      // Referesh the page
      await bs.page.reload(${optArg});
    `;
  },
  description: `Referesh the page`,
  params: [
    {
      inline: true,
      legend: "Options",
      tooltip: "",
      items: [
        {
          name: "params.timeout",
          control: INPUT_NUMBER,
          label: "Timeout",
          initialValue: 30000,
          tooltip: `Maximum navigation time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout.`,
          placeholder: "",
          rules: []
        },

        {
          name: "params.waitUntil",
          control: SELECT,
          label: "Wait until",
          tooltip: `When to consider navigation succeeded, defaults to load. Given an array of event strings, `
            + `navigation is considered to be successful after all events have been fired`,
          placeholder: "",
          initialValue: "load",
          options: [
            "load", "domcontentloaded", "networkidle0", "networkidle2"
          ],
          rules: [{
            required: true,
            message: "Select event"
          }]
        }

      ]
    }
  ]
};
