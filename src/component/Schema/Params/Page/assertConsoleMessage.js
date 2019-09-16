import { buildAssertionTpl } from "service/assert";
import { AssertConsoleMessage } from "../../Assert/AssertConsoleMessage";
import { truncate } from "service/utils";

const MAP_ASSERTION = {
  "not.equals": "none equal",
  "not.contains": "none contain"
};

export const assertConsoleMessage = {

  template: ( command ) => buildAssertionTpl(
    ``,
    command,
    `// Asserting there was no console messages sent to console to satisfy the given constraint`
  ),
  description: `Asserts that there was **NO** console messages sent to console to satisfy the given constraint`,
  commonly: "assert console message",

  toLabel: ({ assert }) => `(${ MAP_ASSERTION[ assert.assertion ] } \`${ truncate( assert.value, 60 ) }\`)`,
  toText: ({ assert }) => `(${ MAP_ASSERTION[ assert.assertion ] } \`${ assert.value }\`)`,

  assert: {
    node: AssertConsoleMessage
  },
  params: [

  ]
};


