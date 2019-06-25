import ExpressionParser from "service/ExpressionParser";
import { INPUT, INPUT_NUMBER, TEXTAREA } from "../../constants";

export const assignVarRemotely = {
  template: ({ params, id }) => {
    const parser = new ExpressionParser( id );
    return `
      // Assign template variable with a webhook
      ENV[ ${ JSON.stringify( params.name ) } ] = await util.pollForValue({
        url: ${ parser.stringify( params.url ) },
        interval: ${ JSON.stringify( params.interval ) },
        timeout: ${ JSON.stringify( params.timeout ) },
        parserFn: ${ params.parserFn },
        requestFn: ${ params.requestFn || "null" },
        parserPayload: {
          sentAt: Date.now()
        }
      });`;
  },
  description: `Polls \`URL\` with a given intervals until a response satisfying \`parserFn\` function received
or a specified timeout exceeded. It can be used, for example,
to retrieve a value from an [email sent by the application under test](https://docs.puppetry.app/testing-emails)`,

  params: [
    {
      legend: "",
      description: "",
      tooltip: "",
      span: { label: 4, input: 18 },
      fields: [
        {
          name: "params.name",
          control: INPUT,
          label: "Variable name",
          description: `Template variable that takes in remotely delivered value`,
          rules: [{
            required: true,
            message: "This field is required"
          },
          {
            validator: ( rule, value, callback ) => {
              const reConst = /^[A-Z_\-0-9]+$/g;
              if ( !value ) {
                callback( `Field is required.` );
              }
              if ( !value.match( reConst ) ) {
                callback( `Shall be in all upper case with underscore separators` );
              }
              callback();
            }
          }
          ]
        },
        {
          name: "params.url",
          control: INPUT,
          label: "URL",
          description: `URL of a remote server REST API to request the desired value`,
          template: true,
          rules: [{
            required: true,
            message: "This field is required"
          }]
        },
        {
          name: "params.interval",
          control: INPUT_NUMBER,
          label: "Interval (ms)",
          initialValue: 1000,
          rules: [{
            required: true,
            message: "This field is required"
          }]
        },
        {
          name: "params.timeout",
          control: INPUT_NUMBER,
          label: "Timeout (ms)",
          initialValue: 60000,
          rules: [{
            required: true,
            message: "This field is required"
          }]
        },
        {
          name: "params.parserFn",
          control: TEXTAREA,
          label: "Parser function",
          description: `Here is expected a body of function that accepts the remote response
(from request function). When the function returns a thruthy value,
it gets assigned to a given template variable. Otherwise the method proceeds polling the remote URL`,
          initialValue: `( json ) => {
  return json ? json.value : null;
}`,
          rules: [{
            required: true,
            message: "This field is required"
          }]
        },
        {
          name: "params.requestFn",
          control: TEXTAREA,
          label: "Request function",
          description: `By default the request is preformed by [node-fetch](https://www.npmjs.com/package/node-fetch)
and it simply returns JSON data received from the remote URL. You can modify
or extend it e.g. into [a chain of requests](https://docs.puppetry.app/testing-emails)`,
          placeholder: `async ( url ) => {
  const rsp = await fetch( url );
  return await rsp.json();
}`
        }

      ]
    }
  ]
};
