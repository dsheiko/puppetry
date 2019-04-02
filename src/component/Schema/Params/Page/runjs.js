import { TEXTAREA } from "../../constants";
import { justify } from "service/assert";

export const runjs = {
  template: ({ params }) => {
    const { value } = params;
    return justify( `
// Run custom JavaScript in the test
${ value }
` );
  },
  description: [
    `Run custom JavaScript code in the test suite with use of Puppeteer API (https://pptr.dev).`,
    `You can access in your code Puppeteer Browser instance as 'bs', Page instance as 'bs.page'.`,
    `All the available methods asynchronous so you shall use them as 'await bs.page.goto( url );'`,
    `Element handlers corresponding your defined targets you can reach like 'await TARGET_NAME()'.`,
    `For example 'await ( await INPUT_FNAME() ).type( "Jon" );'`,
    `Besides you can use Node.js modules. E.g. 'require( "http" ).request(..)'`,
    `Jest API is also available, so you can go with 'describe()', 'test()', 'expect()' and so on`
  ],
  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      items: [
        {
          name: "params.value",
          control: TEXTAREA,
          label: "JavaScript code to run",
          initialValue: "",
          placeholder: "await bs.page.goto('https://example.com');\n"
            + "await bs.page.screenshot( png( \"we are here\" ) );",
          rules: [{
            required: true,
            message: "Code is required"
          }]
        }

      ]
    }
  ]
};
