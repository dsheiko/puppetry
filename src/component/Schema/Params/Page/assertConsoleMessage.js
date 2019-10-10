import { buildAssertionTpl } from "service/assert";
import { AssertConsoleMessage } from "../../Assert/AssertConsoleMessage";
import { truncate } from "service/utils";


function renderBoolean( not ) {
  return [ "true", "false" ].includes( not ) ? not : "false";
}

export const assertConsoleMessage = {

  template: ( command ) => buildAssertionTpl(
    ``,
    command,
    `// Asserting there were (no) console messages sent to console to satisfy the given constraint`
  ),
  description: `Assert console message`,
  commonly: "assert console message",

  toLabel: ({ assert }) => `(${ renderBoolean( assert.not ) ? "none" : "any" } of type \`${ assert.type }\` with \`${ assert.value }\`)`,

  toGherkin: ({ params, assert }) => `Assert that there were
    sent to the console ${ renderBoolean( assert.not ) ? "no" : "any" } messages of type \`${ assert.type }\` with \`${ assert.value }\``,

  assert: {
    node: AssertConsoleMessage
  },
  params: [

  ]
};


