import { buildAssertionTpl } from "service/assert";
import { AssertResponse } from "../../Assert/AssertResponse";
import { normalizeAssertionVerb } from "service/utils";
import { INPUT, SELECT, CHECKBOX } from "../../constants";
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

function renderConstraints( assert, pref = "" ) {
  const res = [];
  if ( assert.status && assert.status !== "any" ) {
    res.push( `status code \`${ assert.status }\`` );
  }
  if ( assert.text && assert.textOperator && assert.textOperator !== "any" ) {
    res.push( `keyword \`${ assert.text }\`` );
  }
  if ( assert.jpExp && assert.jpOperator && assert.jpOperator !== "any" ) {
    res.push( `JSONPath \`${ assert.jpExp }\` = \`${ assert.jpVal }\`` );
  }
  return res.length ? pref + res.join( ", " ) : "";
}

export const assertResponse = {

  template: ( command ) => {

    return buildAssertionTpl( `await bs.network.getResponseMatches(${ JSON.stringify( command.assert ) })`,
      command,
      `// Asserts that the HTTP/S response satisfies the given constraint${
      ( command.params && command.params.waitFor )
      ? `
searchStr = ${ JSON.stringify( command.assert.url ) }.replace( /^\./, "" );
await bs.page.waitForResponse( ( rsp ) => rsp.url().includes( searchStr ), {"timeout":30000} );`
      : `` }
await bs.network.waitUntilResolved();`

    );
  },
  description: `Asserts that the HTTP/S response satisfies the given constraint`,
  commonly: "assert HTTP/S response",

  toLabel: ({ assert }) => `(${ renderBoolean( assert.not ) === "true" ? "none" : "any" } `
  + ` like \`${ assert.method || "GET" } ${ assert.url }\`,`
    + ` ${ renderConstraints( assert ) })`,

  toGherkin: ({ assert }) => `Assert there were ${ assert.not === "true" ? "NO" : "" } requests like `
    + `\`${ assert.method || "GET" } ${ assert.url }\``
    + `${ renderConstraints( assert, " with response like " ) }`,

  assert: {
    node: AssertResponse
  },
  params: [
    {

      legend: "",
      tooltip: "",
      span: {
        wrapperCol: {
          span: 21,
          offset: 0
        }
      },
      fields: [
        {
          name: "params.waitFor",
          label: "Wait for response",
          control: CHECKBOX,
          initialValue: true,
          placeholder: "",
          rules: []
        }
      ]
    }
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
