import { justify } from "service/assert";
export const hover = {
  template: ({ target }) => justify(
    `// Emulating element hover\n`
    + `await ( await ${target}() ).hover();` ),
  description: `Scrolls element into view if needed, and then hovers over the center of the element`,
  params: []
};
