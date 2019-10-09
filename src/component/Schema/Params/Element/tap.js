import { justify } from "service/assert";
import { renderTarget } from "service/utils";

export const tap = {
  template: ({ target }) => justify(
    `// Tap the element\n`
    + `await ( ${ renderTarget( target ) } ).tap();` ),
  toLabel: () => ``,
  commonly: "",
  description: `Taps the element`,
  params: []
};
