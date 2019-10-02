import { INPUT } from "../../constants";
import { buildAssertionTpl } from "service/assert";
import { AssertAssertCount } from "../../Assert/AssertAssertCount";
import ExpressionParser from "service/ExpressionParser";
import { truncate, normalizeAssertionVerb } from "service/utils";

function typesToString( assert ) {
  return Object.keys( assert._enabled )
    .filter( ( key ) => assert._enabled[ key ] )
    .map( ( el ) => `\`${ el }\`` ).join( ", " );
}

export const assertPerfomanceAssetCount = {
  template: ( command ) => {
    const { url, timeout, waitUntil } = command.params,
          parser = new ExpressionParser( command.id ),
          urlString = parser.stringify( url );

    return buildAssertionTpl(
      `bs.performance.resources`,
      command,
      `// Asserting that total number of assets satisfies the given budget\n`
      + `bs.performance.reset();\n`
      + `await bs.page.goto( ${ urlString }, { "waitUntil":"networkidle0" });`
    );
  },

  toLabel: ({ params, assert }) => `(\`${ truncate( params.url, 80 ) }\` for ${ typesToString( assert ) })`,
  toText: ({ params, assert }) => `(\`${ params.url }\` for ${ typesToString( assert ) })`,

  commonly: "assert count of assets",

  description: `Asserts that total number of requested assets `
    + `(JavaScript, CSS, images, media, fonts, XHR) on the page satisfies the given budget`,
  assert: {
    node: AssertAssertCount
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
