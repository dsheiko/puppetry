import { SELECT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";
import { justify } from "service/assert";

function renderState( params ) {
  if ( params.visible !== "on" && params.hidden !== "on" ) {
    return " appears on the page";
  }
  return ( params.visible === "on" ? " is visible" : ( params.hidden === "on"  ? " is hidden" : "" ) );
}

export const waitForTarget = {
  template: ({ params, targetObj }) => {
    const { timeout, visible, hidden } = params,
          options = {
            timeout,
            visible: visible === "on",
            hidden: hidden === "on"
          },
          optArg = isEveryValueMissing( options ) ? `` : `, ${ JSON.stringify( options ) }`;

    if ( targetObj === null ) {
      return;
    }

    return justify( `
// Waiting for the target
await bs.page.${ targetObj.css ? "waitForSelector" : "waitForXPath" }`
    + `( ${ JSON.stringify( targetObj.selector ) }${ optArg } );` );
  },

  toLabel: ({ params }) => {
    return `(\`${ params.value }\` ${ renderState( params ) })`;
  },

  toGherkin: ({ params, target }) => `Wait until target \`${ target }\`
     ${ renderState( params ) } with timeout \`${ params.timeout }ms\``,

  commonly: "wait for target",

  description: `Waits for an element matching a provided
    target to appear in page.

NOTE: This method is ignored by chained targets`,
  params: [
    {
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
