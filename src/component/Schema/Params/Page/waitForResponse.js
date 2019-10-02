import { INPUT, SELECT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";
import { justify } from "service/assert";
import ExpressionParser from "service/ExpressionParser";
import { TXT_PARAM_IS_REQUIRED } from "constant";

export const waitForResponse = {
  template: ({ params, id }) => {
    const { timeout, visible, hidden } = params,
          options = {
            timeout
          },
          parser = new ExpressionParser( id ),
          urlString = parser.stringify( params.value ),
          optArg = isEveryValueMissing( options ) ? `` : `, ${ JSON.stringify( options ) }`;
    return justify( `
// Waiting for a response
await bs.page.waitForResponse( ${ urlString }${ optArg } );` );
  },

  toLabel: ({ params }) => {
    return `(\`${ params.value }\`)`;
  },
  commonly: "wait for response",

  params: [
    {
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          control: INPUT,
          label: "URL",
          placeholder: "e.g. http://example.com/resource",
          description: `You can use [template expressions](https://docs.puppetry.app/template)`,
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
