import { SELECT, INPUT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";
import ExpressionParser from "service/ExpressionParser";
import { truncate } from "service/utils";

/**
 * @typedef {object} TemplatePayload
 * @property {string} target
 * @property {string} method
 * @property {object} assert
 * @property {object} params
 * @property {string} targetSeletor
 * @property {string} id - command id
 */

export const goto = {
  /**
   * @param {TemplatePayload} payload
   * @returns {String}
   */
  template: ({ params, id }) => {
    const { url, timeout, waitUntil } = params,
          options = {
            timeout, waitUntil
          },
          parser = new ExpressionParser( id ),
          urlString = parser.stringify( url ),
          optArg = isEveryValueMissing( options ) ? ` ` : `, ${ JSON.stringify( options ) } `;
    return `
      // Navigating to ${ url }
      bs.performance.reset();
      await bs.page.goto( ${ urlString }${ optArg });
    `;
  },

  description: "Navigates to a given URL and waits until the page loaded",

  toLabel: ({ params }) => `(\`${ params.url }\`)`,
  commonly: "visit page",

  toGherkin: ({ params }) => `Visit \`${ params.url }\``,

  params: [
    {
      legend: "",
      description: "",
      tooltip: "",
      fields: [
        {
          name: "params.url",
          template: true,
          control: INPUT,
          label: "URL",
          tooltip: `URL to navigate page to. The url should include scheme, e.g. https://.`,
          placeholder: "e.g. https://www.google.com/",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        }
      ]
    },
    {
      collapsed: true,
      description: "",
      tooltip: "",

      fields: [
        {
          name: "params.timeout",
          control: INPUT_NUMBER,
          label: "Timeout (ms)",
          initialValue: 30000,
          tooltip: `Maximum navigation time in milliseconds (1sec = 1000ms), `
            + `defaults to 30 seconds, pass 0 to disable timeout.`,
          placeholder: "",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },
        {
          inputStyle: { maxWidth: 200 },
          name: "params.waitUntil",
          control: SELECT,
          label: "Wait till event",
          tooltip: `Waits for a specified event before continue`,
          placeholder: "",
          description: `Where events can be either:
- **[load](https://developer.mozilla.org/en-US/docs/Web/Events/load)** `
          + `- fires when a resource and its dependent resources have finished loading.
- **[domcontentloaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)**  `
          + `- fires when the initial HTML document has been  completely loaded and parsed, `
          + `without waiting for stylesheets, images, and subframes to finish loading.
- **networkidle0** - fires when there are no more than 0 network connections for at least 500 ms.
- **networkidle2** - fires when there are no more than 2 network connections for at least 500 ms.`,
          initialValue: "load",
          options: [
            "load", "domcontentloaded", "networkidle0", "networkidle2"
          ],
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        }
      ]
    }
  ],

  testTypes: {
    "params": {
      "url": "INPUT",
      "timeout": "INPUT_NUMBER",
      "waitUntil": "SELECT"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "url": "http://todomvc.com/examples/react/#/",
        "timeout": 30000,
        "waitUntil": "load"
      }
    }
  ]
};
