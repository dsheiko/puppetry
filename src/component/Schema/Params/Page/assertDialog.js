import { buildAssertionTpl } from "service/assert";
import { AssertDialog } from "../../Assert/AssertDialog";

function renderBoolean( not ) {
  if ( typeof not !== "string" ) {
    return "false";
  }
  return not;
}

export const assertDialog = {

  template: ( command ) => buildAssertionTpl(
    ``,
    command,
    `// Asserting dialog`
  ),
  description: `Asserts there was called a dialog (alert, beforeunload, confirm or prompt).`,
  commonly: "assert dialog",

  toLabel: ({ assert }) => `(${ renderBoolean( assert.not ) === "true" ? "none" : "any" }
    of type \`${ assert.type }\` with \`${ assert.value }\`${ assert.reset !== false ? "and flush stack" : "" })`,

  toGherkin: ({ assert }) => `Assert that there were
    called ${ renderBoolean( assert.not ) === "true" ? "no" : "any" } dialogs
    of type \`${ assert.type }\` with \`${ assert.value }\`${ assert.reset !== false ? "and flush stack" : "" }`,

  assert: {
    node: AssertDialog
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
      "assert": {
        "not": "false",
        "type": "any",
        "assertion": "haveString",
        "value": "foo"
      }
    },
    {
      valid: true,
      "assert": {
        "not": "true",
        "type": "alert",
        "assertion": "haveSubstring",
        "value": "bar"
      }
    }
  ]
};


