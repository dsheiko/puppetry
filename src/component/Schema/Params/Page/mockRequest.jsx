import { SELECT, INPUT, TEXTAREA } from "../../constants";
import ExpressionParser from "service/ExpressionParser";
import contentTypes from "service/contentTypes";
import statusCodes from "service/statusCodes";

/**
 * @typedef {object} TemplatePayload
 * @property {string} target
 * @property {string} method
 * @property {object} assert
 * @property {object} params
 * @property {string} targetSeletor
 * @property {string} id - command id
 */

export const mockRequest = {
  /**
   * @param {TemplatePayload} payload
   * @returns {String}
   */
  template: ({ params, id }) => {
    const { url, statusCode, contentType, body, headers } = params,
          parser = new ExpressionParser( id ),
          urlString = parser.stringify( url ),
          sc = JSON.stringify( statusCode ),
          ct = JSON.stringify( contentType ),
          bo = JSON.stringify( body ),
          he = typeof headers === "undefined" ? "[]" : JSON.stringify( headers
            .replace( /[\n\r]/, "\n" )
            .split( "\n" )
            .filter( data => data.trim().length && data.includes( ":" ) )
            .map( data => {
              const [ name, value ] = data.split( ":" );
              return `${ name.trim().toLowerCase() }: ${ value.trim() }`;
            })
          );
    return `
      // Navigating to ${ url }
      await bs.mockRequest( ${ urlString }, ${ sc }, ${ ct }, ${ bo }, ${ he } );
    `;
  },

  description: `Intercepts to a given URL and replaces it according to provided data

NOTE: As soon as a matching request intercepted the session gets detached,
meaning Puppetry stop listening for mocking. You have to set \`page.mockRequest\`
before every request that you want to mock.`,

  toLabel: ({ params }) => `(\`${ params.url }\` => \`${ params.statusCode }\`,`
    + `\`${ params.contentType }\`, \`${ params.body }\`)`,
  commonly: "mock request",

  toGherkin: ({ params }) => `Listen for the next request like \`*${ params.url }*\` to mock with `
    + ` status \`${ params.statusCode }\`,`
    + ` content type \`${ params.contentType }\`, body \`${ params.body }\``,

  params: [
    {
      legend: "",
      description: "",
      tooltip: "",
      fields: [
        {
          name: "params.url",
          template: true,
          control: INPUT,
          label: "URL",
          tooltip: `Substring matching URL to intercept.`,
          placeholder: "e.g. www.google.com",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        }
      ]
    },
    {
      legend: "Mock data",
      description: "",
      tooltip: "",
      fields: [
        {
          name: "params.statusCode",
          label: "Status code",
          control: SELECT,
          initialValue: "200 OK",
          options: statusCodes,
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },
        {
          name: "params.contentType",
          control: SELECT,
          label: "Content Type",
          initialValue: "application/javascript",
          options: contentTypes,
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },
        {
          name: "params.body",
          control: TEXTAREA,
          label: "Text body",
          placeholder: `{ status: "ok"}`,
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },
        {
          name: "params.headers",
          control: TEXTAREA,
          label: "Headers",
          placeholder: `Accept-Language: en;q=0.8\nX-Access-Token: SECRET`
        }
      ]
    }
  ],

  testTypes: {
    "params": {
      "url": "INPUT",
      "timeout": "INPUT_NUMBER",
      "waitUntil": "SELECT"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "url": "http://todomvc.com/examples/react/#/",
        "statusCode": "200 OK",
        "contentType": "application/javascript",
        "body": "body",
        "headers": "foo: FOO"
      }
    }
  ]
};
