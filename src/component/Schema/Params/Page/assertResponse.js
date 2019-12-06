import { buildAssertionTpl } from "service/assert";
import { AssertResponse } from "../../Assert/AssertResponse";
import { normalizeAssertionVerb } from "service/utils";
import { INPUT, SELECT } from "../../constants";
import ExpressionParser from "service/ExpressionParser";

function renderValue( verb, value ) {
  return ( verb === "empty" || verb === "!empty" ) ? `` : ` \`${ value }\``;
}

function renderBoolean( not ) {
  if ( typeof not !== "string" ) {
    return "false";
  }
  return not;
}

function renderConstraints( assert ) {
  const res = [];
  if ( assert.status !== "any" ) {
    res.push( `status code \`${ assert.status }\`` );
  }
  return res.join( ", " );
}

export const assertResponse = {

  template: ( command ) => {

    return buildAssertionTpl( `bs.network.responses`,
      command,
      `// Asserts that the HTTP/S response satisfies the given constraint`
    );
  },
  description: `Asserts that the HTTP/S response satisfies the given constraint`,
  commonly: "assert HTTP/S response",

  toLabel: ({ assert }) => `(${ renderBoolean( assert.not ) === "true" ? "none" : "any" } `
  + ` like \`${ assert.method || "GET" } ${ assert.url }\`,`
    + ` ${ renderConstraints( assert ) })`,

  toGherkin: ({ assert }) => `Assert there were ${ assert.not === "true" ? "NO" : "" } requests like `
    + `\`${ assert.method || "GET" } ${ assert.url }\` and with `
    + `response ${ renderConstraints( assert ) }`,

  assert: {
    node: AssertResponse
  },
  params: [
  ],

  testTypes: {
    "assert": {
    }
  },

  test: [
    {
      valid: true,
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
