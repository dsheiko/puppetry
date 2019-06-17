import { buildAssertionTpl } from "service/assert";
import { AssertBoolean } from "../../Assert/AssertBoolean";

export const assertVisible = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( await ${ command.target }() ).isVisible()`,
    command,
    `// Asserting that ${ command.target } element is visible`
  ),
  assert: {
    node: AssertBoolean
  },
  description: `Asserts that the element is currently visible in the current viewport
([intersecting](https://pptr.dev/#?product=Puppeteer&version=v1.15.0&show=api-elementhandleisintersectingviewport),
styles \`display\` is not \`none\`, \`visible\` is not \`hidden\`, \`opacity\` is not \`0\`)`,
  params: [
  ]
};
