import { buildAssertionTpl } from "service/assert";
import { AssertDialog } from "../../Assert/AssertDialog";
import { truncate } from "service/utils";
import { CHECKBOX, INPUT } from "../../constants";



export const assertDialog = {

  template: ( command ) => buildAssertionTpl(
    ``,
    command,
    `// Asserting dialog`
  ),
  description: `Asserts there was called a dialog method (alert, beforeunload, confirm or prompt).`,
  commonly: "assert dialog",

  toLabel: ({ assert }) => `(${ assert.assertion } \`${ truncate( assert.value, 60 ) }\`)`,
  toText: ({ assert }) => `(${ assert.assertion } \`${ assert.value }\`)`,

  assert: {
    node: AssertDialog
  },
  params: [
  ]
};


