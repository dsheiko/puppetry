import { TEXTAREA } from "../../constants";
import { justify } from "service/assert";
import { truncate } from "service/utils";


function sanitize( val ) {
  return truncate( val.replace( /["`]/m, "" ), 60 );
}

export const runjs = {
  template: ({ params }) => {
    const { value } = params;
    return justify( `
// Run custom JavaScript in the test
${ value }
` );
  },


  toGherkin: ({ params }) => `Run JavaScript: \`${ sanitize( params.value ) }\``,

  commonly: "run custom JavaScript in the suite",

  description:  `Runs custom JavaScript code in the test suite with use of
[Puppeteer API](https://pptr.dev).
You can access dynamic environment variables via \`ENV\` map (e.g. \`ENV[VAR_NAME]\`)
`,
  params: [
    {

      fields: [
        {
          name: "params.value",
          control: TEXTAREA,
          label: "JavaScript",
          initialValue: "",
          placeholder: "await bs.page.goto('https://example.com');",
          rules: [{
            required: true,
            message: "Code is required"
          }]
        }

      ]
    }
  ],

  testTypes: {
    "params": {
      "value": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "value": "console.log(1);"
      }
    }
  ]
};
