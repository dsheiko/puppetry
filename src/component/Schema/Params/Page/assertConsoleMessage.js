import { buildAssertionTpl } from "service/assert";
import { AssertConsoleMessage } from "../../Assert/AssertConsoleMessage";

function renderBoolean( not ) {
  if ( typeof not !== "string" ) {
    return "false";
  }
  return not;
}

export const assertConsoleMessage = {

  template: ( command ) => buildAssertionTpl(
    ``,
    command,
    `// Asserting there were (no) console messages sent to console to satisfy the given constraint`
  ),
  description: `Assert console message`,
  commonly: "assert console message",

  toLabel: ({ assert }) => `(${ renderBoolean( assert.not ) === "true" ? "none" : "any" }
    of type \`${ assert.type }\` with \`${ assert.value }\`)`,

  toGherkin: ({ assert }) => `Assert that there were
    sent to the console ${ renderBoolean( assert.not ) === "true" ? "no" : "any" } messages
    of type \`${ assert.type }\` with \`${ assert.value }\``,

  assert: {
    node: AssertConsoleMessage
  },
  params: [

  ],

  testTypes: {
    "assert": {
      "not": "SELECT",
      "type": "SELECT",
      "assertion": "SELECT",
      "value": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      assert: {
        not: "true",
        type: "any",
        assertion: "haveString",
        value: "foo"
      }
    },
    {
      valid: true,
      "assert": {
        "not": "false",
        "type": "debug",
        "assertion": "haveSubstring",
        "value": "foo"
      }
    }
  ]

};


