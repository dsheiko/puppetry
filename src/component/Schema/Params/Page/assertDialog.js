import { buildAssertionTpl } from "service/assert";
import { AssertDialog } from "../../Assert/AssertDialog";
import { truncate } from "service/utils";
import { CHECKBOX, INPUT } from "../../constants";

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

export const assertDialog = {

  template: ( command ) => buildAssertionTpl(
    ``,
    command,
    `// Asserting dialog`
  ),
  description: `Asserts there was called a dialog (alert, beforeunload, confirm or prompt).`,
  commonly: "assert dialog",

  toLabel: ({ assert }) => `(${ render( assert ) }  \`${ truncate( assert.value, 60 ) }\`)`,
  toText: ({ assert }) => `(${ render( assert ) } \`${ assert.value }\`)`,

  assert: {
    node: AssertDialog
  },
  params: [
  ]
};


