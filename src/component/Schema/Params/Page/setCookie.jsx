import { SELECT, INPUT, INPUT_NUMBER } from "../../constants";
import ExpressionParser from "service/ExpressionParser";


export const setCookie = {
  /**
   * @param {TemplatePayload} payload
   * @returns {String}
   */
  template: ({ params, id }) => {

    const { name, value, domain, path, expires, httpOnly, secure, sameSite } = params,
          parser = new ExpressionParser( id );
    return `
      // Set cookies on the page
      await bs.page.setCookie({
        name: ${ parser.stringify( name ) },
        value: ${ parser.stringify( value ) },
        domain: ${ parser.stringify( domain ) },
        path: ${ path ? parser.stringify( path ) : "undefined" },
        expires: ${ expires || "undefined" },
        httpOnly: ${ httpOnly ? httpOnly : "undefined" },
        secure: ${ secure ? secure : "undefined" },
        sameSite: ${ sameSite ? parser.stringify( sameSite ) : "undefined" }
      });
    `;
  },


  toLabel: ({ params }) => `(\`${ params.name }\`, \`${ params.value }\`)`,
  toGherkin: ({ params }) => `Set page cookie \`${ params.name }\` = \`${ params.value }\``,
  commonly: "set page cookies",

  description: "Sets [cookies](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) on the page",

  params: [
    {
      legend: "",
      description: "",
      tooltip: "",
      fields: [
        {
          name: "params.name",
          template: true,
          control: INPUT,
          inputStyle: { maxWidth: 432 },
          label: "Name",
          placeholder: "e.g. foo",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },
        {
          name: "params.value",
          template: true,
          control: INPUT,
          label: "Value",
          placeholder: "e.g. FOO",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },
        {
          name: "params.domain",
          template: true,
          control: INPUT,
          label: "Domain",
          inputStyle: { maxWidth: 432 },
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
          name: "params.path",
          control: INPUT,
          label: "Path"
        },
        {
          name: "params.expires",
          control: INPUT_NUMBER,
          describe: "Unix time in seconds.",
          label: "Expires",
          initialValue: Date.now() + 86400000
        },
        {
          name: "params.httpOnly",
          control: SELECT,
          inputStyle: { maxWidth: 200 },
          label: "HTTP-only",
          initialValue: "true",
          options: [ "", "true", "false" ]
        },
        {
          name: "params.secure",
          control: SELECT,
          inputStyle: { maxWidth: 200 },
          label: "Secure",
          initialValue: "false",
          options: [ "", "true", "false" ]
        },
        {
          name: "params.sameSite",
          control: SELECT,
          inputStyle: { maxWidth: 200 },
          label: "Same site",
          initialValue: "Lax",
          options: [ "", "Strict", "Lax" ]
        }
      ]
    }
  ],

  testTypes: {
    "params": {
      "name": "INPUT",
      "value": "INPUT",
      "domain": "INPUT",
      "path": "INPUT",
      "expires": "INPUT",
      "httpOnly": "SELECT",
      "secure": "SELECT",
      "sameSite": "SELECT"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "name": "ipsum",
        "value": "IPSUM",
        "domain": "domain",
        "path": "/path/",
        "expires": 111111111,
        "httpOnly": "true",
        "secure": "true",
        "sameSite": "Lax"
      }
    }
  ]
};
