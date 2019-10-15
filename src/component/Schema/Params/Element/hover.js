import { justify } from "service/assert";
import { renderTarget } from "service/utils";

export const hover = {
  template: ({ target }) => justify(
    `// Emulating element hover\n`
    + `await ( ${ renderTarget( target ) } ).hover();` ),
  toLabel: () => ``,
  toGherkin: ({ target, params }) => `Hover \`${ target }\``,
  commonly: "",
  description: `Scrolls element into view if needed, and then hovers over the center of the element`,
  params: [],
 
  test: [
    {
      valid: true
    }
  ]
};
