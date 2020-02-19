import { SELECT, INPUT, TEXTAREA } from "../../constants";
import ExpressionParser from "service/ExpressionParser";
import contentTypes from "service/contentTypes";
import statusCodes from "service/statusCodes";
import fs from "fs";
import { join } from "path";

/**
 *
 * @param {String} tpl
 * @param {String} id
 * @returns {String}
 */
function stringifyTpl( tpl, id ) {
  const parser = new ExpressionParser( id );
  return parser.stringify( tpl );
}

/**
 * @param {String} projectDirectory
 * @param {String} filePath
 */
function readFile( projectDirectory, filePath ) {
  const relPath = join( projectDirectory, filePath );
  if ( fs.existsSync( relPath ) ) {
    return fs.readFileSync( relPath, "utf8" );
  }
  return fs.readFileSync( filePath, "utf8" );
}

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
  template: ({ params, id, projectDirectory }) => {
    const { url, method, statusCode, contentType, body, bodyPath, headers } = params,
          urlString = stringifyTpl( url, id ),
          me = JSON.stringify( method ),
          sc = JSON.stringify( statusCode ),
          ct = JSON.stringify( contentType ),
          bo = bodyPath ? JSON.stringify( readFile( projectDirectory, bodyPath ) ) : stringifyTpl( body, id ),
          he = typeof headers === "undefined" ? "[]" : stringifyTpl( headers
            .replace( /[\n\r]/, "\n" )
            .split( "\n" )
            .filter( data => data && data.trim().length && data.includes( ":" ) )
            .map( data => {
              const [ name, value ] = data.split( ":" );
              return `${ name.trim().toLowerCase() }: ${ value.trim() }`;
            }), id
          );
    return `
      // Navigating to ${ url }
      await bs.mockRequest( ${ urlString }, ${ me }, ${ sc }, ${ ct }, ${ bo }, ${ he } );
    `;
  },

  description: `Intercepts to a given URL and replaces it according to provided data

NOTE: As soon as a matching request intercepted the session gets detached,
meaning Puppetry stop listening for mocking. You have to set \`page.mockRequest\`
before every request that you want to mock.`,

  toLabel: ({ params }) => `(\`${ params.method || "GET" } ${ params.url }\` => \`${ params.statusCode }\`,`
    + `\`${ params.contentType }\`, \`${ params.bodyPath ? params.bodyPath : params.body }\`)`,
  commonly: "mock request",

  toGherkin: ({ params }) => `Listen for the next request like `
    + `\`${ params.method || "GET" } *${ params.url }*\` to mock with `
    + ` status \`${ params.statusCode }\`,`
    + ` content type \`${ params.contentType }\`, body \`${ params.bodyPath ? params.bodyPath : params.body }\``,


  validate: ( values ) => {
    const { body, bodyPath } = values.params;
    if ( body && body.trim() ) {
      return null;
    }
    if ( bodyPath && bodyPath.trim() ) {
      return null;
    }
    return "You have to ether specify text body or select a JSON file";
  },

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
        },
        {
          name: "params.method",
          inputStyle: { maxWidth: 200 },
          control: SELECT,
          label: "Request method",
          initialValue: "GET",
          options: [ "GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH" ]
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
          description: `You can use [template expressions](https://docs.puppetry.app/template)`
        },
        {
          name: "params.bodyPath",
          control: INPUT,
          optional: true,
          label: "...or JSON file",
          tooltip: "Please, provide a path relative to the project location",
          placeholder: "",
          rules: [{
            message: "Select a file path to seed the body"
          }]
        },
        {
          name: "params.headers",
          control: TEXTAREA,
          label: "Headers",
          placeholder: `Accept-Language: en;q=0.8\nX-Access-Token: SECRET`,
          description: `You can use [template expressions](https://docs.puppetry.app/template)`
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
