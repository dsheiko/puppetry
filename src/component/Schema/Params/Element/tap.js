import { justify } from "service/assert";
import { renderTarget } from "service/utils";

export const tap = {
  template: ({ target }) => justify(
    `// Tap the element\n`
    + `await ( ${ renderTarget( target ) } ).tap();` ),
  toLabel: () => ``,
  toGherkin: ({ target }) => `Tap \`${ target }\``,
  commonly: "",
  description: `Taps the element`,
  params: [],

  test: [
    {
      valid: true
    }
  ]
};
