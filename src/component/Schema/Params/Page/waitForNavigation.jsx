import { SELECT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";

export const waitForNavigation = {

  template: ({ params }) => {
    const { timeout, waitUntil } = params,
          options = {
            timeout, waitUntil
          },
          optArg = isEveryValueMissing( options ) ? `` : ` ${ JSON.stringify( options ) } `;
    return `
      // Waiting for the given event
      try {
        await bs.page.waitForNavigation(${optArg});
      } catch ( e ) {
        // if timeout, try to proceed anyways
      }
    `;
  },

  toLabel: ({ params }) => {
    return params.waitUntil ? `(\`${ params.waitUntil }\`)` : `(${ params.timeout }ms)`;
  },
  commonly: "wait for navigation",

  description: `Waits until a given event before proceeding to the next command`,

  params: [
    {
      collapsed: true,
      tooltip: "",
      fields: [
        {
          name: "params.timeout",
          control: INPUT_NUMBER,
          label: "Timeout (ms)",
          initialValue: 30000,
          tooltip: `Maximum navigation time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout.`,
          placeholder: "",
          rules: []
        },

        {
          name: "params.waitUntil",
          control: SELECT,
          label: "Wait until event",
          tooltip: `Waits for a specified event before continue`,
          placeholder: "",
          initialValue: "load",
          options: [
            "load", "domcontentloaded", "networkidle0", "networkidle2"
          ],
          rules: [{
            required: true,
            message: "Select event"
          }],
          description: `Where events can be either:
- **[load](https://developer.mozilla.org/en-US/docs/Web/Events/load)** - fires when a`
          + ` resource and its dependent resources have finished loading.
- **[domcontentloaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)**  `
          + `- fires when the initial HTML document has been  completely loaded and parsed, `
          + `without waiting for stylesheets, images, and subframes to finish loading.
- **networkidle0** - fires when there are no more than 0 network connections for at least 500 ms.
- **networkidle2** - fires when there are no more than 2 network connections for at least 500 ms.`
        }

      ]
    }
  ]
};
