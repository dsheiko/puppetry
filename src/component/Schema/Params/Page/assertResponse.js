import { buildAssertionTpl } from "service/assert";
import { AssertResponse } from "../../Assert/AssertResponse";
import { normalizeAssertionVerb } from "service/utils";
import { INPUT } from "../../constants";
import ExpressionParser from "service/ExpressionParser";

function renderValue( verb, value ) {
  return ( verb === "empty" || verb === "!empty" ) ? `` : ` \`${ value }\``;
}

function renderConstraints( assert ) {
  const res = [];

  if ( assert.statusOperator !== "any" ) {
    res.push( `status code ${ normalizeAssertionVerb( assert.statusOperator ) }`
      + `${ renderValue( assert.statusOperator, assert.statusValue ) }` );
  }

  if ( assert.statusTextOperator !== "any" ) {
    res.push( `status text ${ normalizeAssertionVerb( assert.statusTextOperator ) }`
      + `${ renderValue( assert.statusTextOperator, assert.statusTextValue ) }` );
  }

  if ( assert.textOperator !== "any" ) {
    res.push( `data ${ normalizeAssertionVerb( assert.textOperator ) }`
      + `${ renderValue( assert.textOperator, assert.textValue ) }` );
  }
  if ( assert.headerOperator !== "any" ) {
    res.push( `header \`${ assert.headerName }: ${ assert.headerValue }\`` );
  }
  return res.join( ", " );
}

export const assertResponse = {

  template: ( command ) => {
    const parser = new ExpressionParser( command.params.id ),
          urlString = parser.stringify( command.params.url );

    return buildAssertionTpl(
      `await bs.page.goto( ${ urlString }, { waitUntil: "networkidle0" } )`,
      command,
      `// Asserts that the HTTP/S response satisfies the given constraint`
    );
  },
  description: `Asserts that the HTTP/S response satisfies the given constraint`,
  commonly: "assert HTTP/S response",

  toLabel: ({ params, assert }) => `(\`${ params.url }\`, ${ renderConstraints( assert ) })`,

  toGherkin: ({ params, assert }) => `Assert that URL \`${ params.url }\` `
    + `responds with ${ renderConstraints( assert ) }`,

  assert: {
    node: AssertResponse
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
