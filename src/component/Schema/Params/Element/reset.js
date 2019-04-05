import { justify } from "service/assert";
export const reset = {
  template: ({ targetSeletor }) => justify(
    `// Reset the input\n`
  + `await bs.page.$eval( '${ targetSeletor }', el => { el.value = ""; })` ),
  description: `Resets the input element`,
  params: []
};
