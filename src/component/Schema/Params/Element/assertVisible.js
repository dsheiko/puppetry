import { buildAssertionTpl } from "service/assert";
import { AssertBoolean } from "../../Assert/AssertBoolean";
import { renderTarget } from "service/utils";

export const assertVisible = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( ${ renderTarget( command.target ) } ).isVisible()`,
    command,
    `// Asserting that ${ command.target } element is visible`
  ),

  toLabel: ({ assert }) => `(\`${ assert.value ? "visible" : "not visible" }\`)`,

  toGherkin: ({ target, params, assert }) => `Assert that element \`${ target }\`
    is \`${ assert.value ? "visible" : "not visible" }\` on the page`,

  commonly: "assert it is visible",

  assert: {
    node: AssertBoolean,
    options: {
      textNode: "is visible"
    }
  },
  description: `Asserts that the element is currently visible in the current viewport
([intersecting](https://pptr.dev/#?product=Puppeteer&version=v1.15.0&show=api-elementhandleisintersectingviewport),
styles \`display\` is not \`none\`, \`visible\` is not \`hidden\`, \`opacity\` is not \`0\`)`,
  params: [
  ]
};
