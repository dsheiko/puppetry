import { INPUT, SELECT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";
import { justify } from "service/assert";
import { TXT_PARAM_IS_REQUIRED } from "constant";

export const waitForSelector = {
  template: ({ params }) => {
    const { timeout, visible, hidden } = params,
          options = {
            timeout,
            visible: visible === "on",
            hidden: hidden === "on"
          },
          optArg = isEveryValueMissing( options ) ? `` : `, ${ JSON.stringify( options ) }`;
    return justify( `
// Waiting for an element matching ${params.value}
await bs.page.waitForSelector( "${params.value}"${ optArg } );` );
  },
  description: `Waiting for an element matching a provided `
    + `[CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)`,
  params: [
    {
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          control: INPUT,
          label: "CSS selector",
          tooltip: "A selector of an element to wait for",
          placeholder: "",
          rules: [{
            required: true,
            message: TXT_PARAM_IS_REQUIRED
          }]
        }
      ]
    },
    {
      collapsed: true,
      tooltip: "",
      span: { label: 4, input: 18 },
      fields: [
        {
          name: "params.visible",
          control: SELECT,
          label: "Visible",
          tooltip: `wait for element to be present in DOM and to be visible, `
            + `i.e. to not have display: none or visibility: hidden`,
          placeholder: "",
          initialValue: "off",
          options: [
            "on", "off"
          ]
        },
        {
          name: "params.hidden",
          control: SELECT,
          label: "Hidden",
          tooltip: `wait for element to not be found in the DOM or to be hidden, `
            + `i.e. have display: none or visibility: hidden`,
          placeholder: "",
          initialValue: "off",
          options: [
            "on", "off"
          ]
        },
        {
          name: "params.timeout",
          control: INPUT_NUMBER,
          label: "Timeout",
          initialValue: 30000,
          tooltip: `Maximum navigation time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout.`,
          placeholder: "",
          rules: []
        }


      ]
    }
  ]
};
