import { justify } from "service/assert";
export const tap = {
  template: ({ target }) => justify(
    `// Tap the element\n`
    + `await ( await ${target}() ).tap();` ),
  description: `Taps the element`,
  params: []
};
