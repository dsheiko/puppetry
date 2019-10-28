import { INPUT, SELECT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";
import { validateSimpleSelector } from "service/selector";
import { justify } from "service/assert";
import { TXT_PARAM_IS_REQUIRED, SELECTOR_XPATH } from "constant";

function renderState( params ) {
  if ( params.visible !== "on" && params.hidden !== "on" ) {
    return " appears on the page";
  }
  return ( params.visible === "on" ? " is visible" : ( params.hidden === "on"  ? " is hidden" : "" ) );
}

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
// Waiting for an element matching ${ params.value }
await bs.page.${ ( typeof window !== "undefined" && validateSimpleSelector( params.value ) === SELECTOR_XPATH )
    ? "waitForXPath" : "waitForSelector" }`
    + `( ${ JSON.stringify( params.value ) }${ optArg } );` );
  },

  toLabel: ({ params }) => {
    return `(\`${ params.value }\` ${ renderState( params ) })`;
  },

  toGherkin: ({ params }) => `Wait until element \`${ params.value }\`
     ${ renderState( params ) } with timeout \`${ params.timeout }ms\``,

  commonly: "wait for selector/XPath",

  description: `Waits for an element matching a provided
    [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
    or [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) to appear in page`,
  params: [
    {
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          control: INPUT,
          label: "CSS selector or XPath",
          tooltip: "A selector or XPath of an element to wait for",
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
      fields: [
        {
          name: "params.visible",
          control: SELECT,
          inputStyle: { maxWidth: 88 },
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
          inputStyle: { maxWidth: 88 },
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
  ],
  testTypes: {
    "params": {
      "value": "INPUT",
      "visible": "SELECT",
      "hidden": "SELECT",
      "timeout": "INPUT_NUMBER"
    }
  },
  test: [
    {
      valid: true,
      "params": {
        "value": ".foo",
        "visible": "off",
        "hidden": "on",
        "timeout": 30000
      }
    }
  ]
};
