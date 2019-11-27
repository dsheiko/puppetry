import { INPUT, CHECKBOX, TARGET_SELECT } from "../../constants";
import { isEveryValueMissing, ruleValidateGenericString } from "service/utils";
import ExpressionParser from "service/ExpressionParser";
import { renderTarget } from "service/utils";
import { getCounter } from "service/screenshotCounter";

function getTargetMap( targetsArr ){
  return `{
${ targetsArr.map(
    ( name ) => `          "${ name }": async () =>  await bs.getTargetOrFalse(${ JSON.stringify( name ) })` )
    .join( ",\n" ) }
        }`;
}

export const screenshot = {
  template: ({ target, params, id, parentId }) => {
    const { name, omitBackground } = params,
          parser = new ExpressionParser( id ),
          baseOptions = {
            omitBackground
          },
          options = baseOptions,
          optArg = isEveryValueMissing( options ) ? ` ` : `, ${ JSON.stringify( options ) } `,
          makeScreenshotCode = `await ( ${ renderTarget( target ) } ).`
            + `screenshot( util.png( ${ JSON.stringify( id ) }, `
            + `${ parentId ? JSON.stringify( parentId ) : "null" }, ${ parser.stringify( name ) }${ optArg }) )`;
    return `
      // Taking screenshot of ${ target } element${
  ( typeof params.targets !== "undefined" && typeof params.targets.length !== "undefined"
        && params.targets.length )
    ? `
      await bs.traceTarget( "${ id }",
        ${ getTargetMap( params.targets ) },
        async() => {
          ${ makeScreenshotCode };
        });`
    : `
      ${ makeScreenshotCode };`}
  `;
  },

  toLabel: ({ params }) => `(\`${ params.name }\`)`,
  commonly: "make screenshot",

  toGherkin: ({ target, params }) => `Take screenshot \`${ params.name }\` of \`${ target }\``,

  description: `Takes a screenshot of the target element.`,

  requiresTargets: true,

  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.name",
          template: true,
          control: INPUT,
          label: "Description",
          tooltip: `The description is a plain text, which will be normalized to screenshot file name.
              Slashes can be used to set file location: 'foo/bar/baz'.`,
          placeholder: "e.g. The form is just submitted",
          initialValue: ( record ) => `Element ${ getCounter( record.id ) || "" }`,
          rules: [{
            required: true,
            message: "Screenshot description required"
          },
          {
            validator: ruleValidateGenericString
          },
          {
            transform: ( value ) => value.trim()
          }]
        },
        {
          name: "params.targets",
          label: "show targets",
          control: TARGET_SELECT,
          tooltip: `Here you can select targets to be highlighted on the screenshot.`,
          initialValue: [],
          placeholder: "",
          rules: []
        },
        {
          name: "params.omitBackground",
          label: "omit background",
          control: CHECKBOX ,
          tooltip: `Hides default white background and allows capturing screenshots with transparency.`,
          initialValue: false,
          placeholder: "",
          rules: []
        }
      ]
    }

  ],

  testTypes: {
    "params": {
      "name": "INPUT",
      "omitBackground": "CHECKBOX"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "name": "Element 1",
        "omitBackground": false
      }
    }
  ]
};
