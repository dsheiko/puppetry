import React from "react";
import { SELECT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";
import Link from "component/Global/Link";

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
  description: `Refereshes the page`,
  params: [
    {
      collapsed: true,
      tooltip: "",
      span: { label: 4, input: 18 },
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
          inputStyle: { maxWidth: 200 },
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
- **[load](https://developer.mozilla.org/en-US/docs/Web/Events/load)** - fires when a resource and its dependent resources have finished loading.
- **[domcontentloaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)**  - fires when the initial HTML document has been  completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
- **networkidle0** - fires when there are no more than 0 network connections for at least 500 ms.
- **networkidle2** - fires when there are no more than 2 network connections for at least 500 ms.`,

        }

      ]
    }
  ]
};
