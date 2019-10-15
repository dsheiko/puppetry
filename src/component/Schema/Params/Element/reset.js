import { justify } from "service/assert";

export const reset = {
  template: ({ targetSeletor }) => justify(
    `// Reset the input or form\n`
  + `await bs.page.$eval( '${ targetSeletor }', el => {
  if ( el.tagName === "FORM" ) {
    el.reset();
    return;
  }
  if ( "value" in el ) {
    el.value = "";
  }
})` ),
  toLabel: () => ``,
  toGherkin: ({ target, params }) => `Reset form/input \`${ target }\``,
  commonly: "reset input or form",
  description: `Resets the input or form element`,
  params: [],
 
  test: [
    {
      valid: true
    }
  ]
};
