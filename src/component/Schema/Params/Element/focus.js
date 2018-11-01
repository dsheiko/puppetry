import { justify } from "service/assert";
export const focus = {
  template: ({ target }) => justify(
    `// Focusing the element\n`
    + `await ( await ${target}() ).focus();` ),
  description: `Focuses the element`,
  params: []
};
