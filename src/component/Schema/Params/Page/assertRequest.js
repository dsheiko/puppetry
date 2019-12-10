import { buildAssertionTpl } from "service/assert";
import { AssertRequest } from "../../Assert/AssertRequest";
import { normalizeAssertionVerb } from "service/utils";
import { INPUT, SELECT } from "../../constants";
import ExpressionParser from "service/ExpressionParser";

function renderValue( verb, value ) {
  return ( verb === "empty" || verb === "!empty" ) ? `` : ` \`${ value }\``;
}

function renderConstraints( assert, prefix ) {
  const res = [];

  if ( assert.statusOperator && assert.statusOperator !== "any" ) {
    res.push( `status code ${ normalizeAssertionVerb( assert.statusOperator ) }`
      + `${ renderValue( assert.statusOperator, assert.statusValue ) }` );
  }

  if ( assert.textOperator && assert.textOperator !== "any" ) {
    res.push( `body ${ normalizeAssertionVerb( assert.textOperator ) }`
      + `${ renderValue( assert.textOperator, assert.textValue ) }` );
  }

  if ( assert.headerOperator && assert.headerOperator !== "any" ) {
    res.push( `header \`${ assert.headerName }: ${ assert.headerValue }\`` );
  }
  return res.length ? prefix + res.join( ", " ) : "";
}

export const assertRequest = {

  template: ( command ) => {
    const parser = new ExpressionParser( command.params.id ),
          urlString = parser.stringify( command.params.url ),
          intercept = ( command.params.method && command.params.method !== "GET" )
            ? ( `bs.replaceRequest( ${ JSON.stringify( command.params.method ) },`
              + ` ${ JSON.stringify( command.params.data ) } );` )
            : ``;

    return buildAssertionTpl(`await bs.page.goto( ${ urlString }, { waitUntil: "networkidle0" } )`,
      command,
      `// Makes HTTP/S request and asserts that the response satisfies the given constraint
${ intercept }`
    );
  },
  description: `Makes HTTP/S request and asserts that the response satisfies the given constraint`,
  commonly: "make request and assert response",

  toLabel: ({ params, assert }) => `(\`${ params.method || "GET" } ${ params.url }\``
    + ` ${ renderConstraints( assert, ", " ) })`,

  toGherkin: ({ params, assert }) => `Make request \`${ params.method || "GET" } ${ params.url }\` `
    + `${ renderConstraints( assert, ` and assert that response has ` ) }`,

  assert: {
    node: AssertRequest
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
          tooltip: `URL to request. The url should include scheme, e.g. https://.`,
          placeholder: "e.g. https://www.google.com/",
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
        },
        {
          name: "params.data",
          control: INPUT,
          label: "POST data",
          description: `As URL-encoded form (application/x-www-form-urlencoded)`,
          placeholder: "paramFoo=value&paramBar=value"
        }
      ]
    }
  ],

  testTypes: {
    "assert": {
      "assertion": "SELECT",
      "value": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      params: {
        url: "https://httpstat.us/200"
      },
      "assert": {
        assertion: "response",
        textOperator: "any",
        headerOperator: "any",
        statusOperator: "any",
        statusTextOperator: "any"
      }
    }
  ]
};
