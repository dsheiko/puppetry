import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertAssertWeight } from "../../Assert/AssertAssertWeight";
import ExpressionParser from "service/ExpressionParser";
import { truncate, normalizeAssertionVerb } from "service/utils";

export const assertPerfomanceAssetWeight = {
  template: ( command ) => {
    const { url, timeout, waitUntil } = command.params,
          parser = new ExpressionParser( command.id ),
          urlString = parser.stringify( url );

    return buildAssertionTpl(
      `bs.performance.resources`,
      command,
      `// Asserting that total weight of assets satisfies the given budget\n`
      + `bs.performance.reset();\n`
      + `await bs.page.goto( ${ urlString }, { "waitUntil":"networkidle0" });`
    );
  },

  toLabel: ({ params }) => `(\`${ truncate( params.url, 80 ) }\`)`,
  toText: ({ params }) => `(\`${ params.url }\`)`,

  commonly: "assert weight of assets (JavaScript, CSS, images, fonts, XHR)",

  description: `Asserts that total weight of assets satisfies the given budget`,
  assert: {
    node: AssertAssertWeight
  },
  params: [

    {
      legend: "",
      description: "",
      tooltip: "",
      fields: [
        {
          name: "params.url",
          template: true,
          control: INPUT,
          label: "URL",
          tooltip: `URL to navigate page to. The url should include scheme, e.g. https://.`,
          placeholder: "e.g. https://www.google.com/",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        }
      ]
    }

  ]
};
