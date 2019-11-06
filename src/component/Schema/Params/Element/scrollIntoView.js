import { justify } from "service/assert";
import { renderTarget } from "service/utils";

export const scrollIntoView = {
  template: ({ targetSeletor }) => justify(
    `// Scrolls element into view\n`
    + `await bs.page.$eval( '${ targetSeletor }', el => el.scrollIntoView() );` ),
  toLabel: () => ``,
  toGherkin: ({ target }) => `Scroll \`${ target }\` into view`,
  commonly: "scroll into view",
  description: `Scrolls element into view`,
  params: [],

  test: [
    {
      valid: true
    }
  ]
};
