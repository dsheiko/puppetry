import { TEXTAREA } from "../../constants";
import { justify } from "service/assert";
import ExpressionParser from "service/ExpressionParser";

export const runjs = {
  template: ({ params, id }) => {
    const { value } = params,
          parser = new ExpressionParser( id );
    return justify( `
// Run custom JavaScript in the test
${ value }
` );
  },
  description:  `Run custom JavaScript code in the test suite with use of
[Puppeteer API](https://pptr.dev) and [Puppetry API](https://docs.puppetry.app/command-api).
You can access [dynamic environment variables](https://docs.puppetry.app/template)
via \`ENV\` map (e.g. \`ENV[VAR_NAME]\`)
`,
  params: [
    {

      fields: [
        {
          name: "params.value",
          control: TEXTAREA,
          label: "JavaScript code to run",
          initialValue: "",
          placeholder: "await bs.page.goto('https://example.com');\n"
            + "await bs.page.screenshot( util.png( \"we are here\" ) );",
          rules: [{
            required: true,
            message: "Code is required"
          }]
        }

      ]
    }
  ]
};
