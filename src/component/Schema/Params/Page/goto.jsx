import React from "react";
import { SELECT, INPUT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";
import Link from "component/Global/Link";
import ExpressionParser from "service/ExpressionParser";

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
      await bs.page.goto( ${ urlString }${ optArg });
    `;
  },

  description: `Navigates to a given URL`,

  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      items: [
        {
          name: "params.url",
          control: INPUT,
          label: "URL",
          tooltip: `URL to navigate page to. The url should include scheme, e.g. https://.`,
          placeholder: "",
          rules: [{
            required: true,
            message: "Enter URL"
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
          name: "params.timeout",
          control: INPUT_NUMBER,
          label: "Timeout (ms)",
          initialValue: 30000,
          tooltip: `Maximum navigation time in milliseconds (1sec = 1000ms), `
            + `defaults to 30 seconds, pass 0 to disable timeout.`,
          placeholder: "",
          rules: []
        },

        {
          name: "params.waitUntil",
          control: SELECT,
          label: "Wait until event",
          tooltip: `Waits for a specified event before continue`,
          placeholder: "",
          description: <div>Where events can be either:
            <ul>
              <li><b><Link to="https://developer.mozilla.org/en-US/docs/Web/Events/load">load</Link></b>
          - fires when a resource and its dependent resources have finished loading.</li>
              <li><b>
                <Link to="https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded">
                domcontentloaded</Link></b>
          - fires when the initial HTML document has been
          completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.</li>
              <li><b>networkidle0</b> - fires when there are no more than 0
              network connections for at least 500 ms.</li>
              <li><b>networkidle2</b> - fires when there are no more than 2
          network connections for at least 500 ms.</li>
            </ul>
          </div>,
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
