import { INPUT, INPUT_NUMBER, CHECKBOX } from "../../constants";
import { isEveryValueMissing } from "service/utils";
import { justify } from "service/assert";
import ExpressionParser from "service/ExpressionParser";
import { TXT_PARAM_IS_REQUIRED } from "constant";

export const waitForResponse = {
  template: ({ params, id }) => {
    const { timeout, skip } = params,
          options = {
            timeout
          },
          parser = new ExpressionParser( id ),
          urlString = parser.stringify( params.value ),
          optArg = isEveryValueMissing( options ) ? `` : `, ${ JSON.stringify( options ) }`,
          predicate = `( rsp ) => rsp.url().includes( searchStr )`;
    return justify( `
// Waiting for a response
searchStr = ${ urlString }.replace( /^\\./, "" );
if ( ${ skip ? `!bs.performance.resources.find( item =>  item.url.includes( searchStr ) )` : `true` } ) {
  await bs.page.waitForResponse( ${ predicate }${ optArg } );
}` );
  },

  toLabel: ({ params }) => {
    return `(\`${ params.value }\`, timeout \`${ params.timeout }ms)`;
  },

  toGherkin: ({ params }) => `Wait for response \`${ params.value }\`
    with timeout \`${ params.timeout }ms\`${ params.skip ? `, skip when already responded` : `` }`,

  commonly: "wait for response",

  description: `Waits for response.

  NOTE: This method watches for on-page responses, but ignores internal like page.goto`,

  params: [
    {
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          control: INPUT,
          label: "URL",
          tooltip: "Specify here a part of URL to match a response we are waiting for",
          placeholder: "e.g. http://example.com/resource or /resource",
          description: `You can use [template expressions](https://docs.puppetry.app/template)`,
          rules: [{
            required: true,
            message: TXT_PARAM_IS_REQUIRED
          }]
        },
        {
          name: "params.skip",
          control: CHECKBOX,
          label: "skip if already responded",
          initialValue: false,
          tooltip: `Do not wait if any request for URL matching the provided string already responded.`,
          placeholder: "",
          rules: []
        }
      ]
    },
    {
      collapsed: true,
      tooltip: "",
      fields: [
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
      "timeout": "INPUT_NUMBER"
    }
  },
  test: [
    {
      valid: true,
      "params": {
        "value": "https://google.com",
        "timeout": 30000
      }
    }
  ]
};
