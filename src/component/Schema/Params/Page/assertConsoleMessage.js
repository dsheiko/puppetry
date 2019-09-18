import { buildAssertionTpl } from "service/assert";
import { AssertConsoleMessage } from "../../Assert/AssertConsoleMessage";
import { truncate } from "service/utils";

const MAP_ASSERTION = {
  "true": {
    haveString: "does not have",
    haveSubstring: "does not contain"
  },
  "false": {
    haveString: "has",
    haveSubstring: "contains"
  }
};

function render({ not, assertion, type }) {
  const key = [ "true", "false" ].includes( not ) ? not : "false";
  return `\`${ type }\`, ` + MAP_ASSERTION[ key ][ assertion ];
}
export const assertConsoleMessage = {

  template: ( command ) => buildAssertionTpl(
    ``,
    command,
    `// Asserting there were (no) console messages sent to console to satisfy the given constraint`
  ),
  description: `Assert console message`,
  commonly: "assert console message",

  toLabel: ({ assert }) => `(${ render( assert ) } \`${ truncate( assert.value, 60 ) }\`)`,
  toText: ({ assert }) => `(${ render( assert ) } \`${ assert.value }\`)`,

  assert: {
    node: AssertConsoleMessage
  },
  params: [

  ]
};


