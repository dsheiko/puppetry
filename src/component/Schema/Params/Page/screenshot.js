import { INPUT, INPUT_NUMBER, TARGET_SELECT, CHECKBOX } from "../../constants";
import { isEveryValueFalsy, isSomeValueNull, ruleValidateGenericString, renderPage } from "service/utils";
import ExpressionParser from "service/ExpressionParser";
import { getCounter } from "service/screenshotCounter";

function getTargetMap( targetsArr ){
  return `{
${ targetsArr.map(
    ( name ) => `          "${ name }": async () =>  await bs.getTargetOrFalse(${ JSON.stringify( name ) })` )
    .join( ",\n" ) }
        }`;
}

export const screenshot = {
  template: ({ params, id, parentId, window }) => {
    const { name, fullPage, omitBackground, x, y, width, height } = params,
          parser = new ExpressionParser( id ),
          clip = {
            x,
            y,
            width,
            height
          },
          baseOptions = {
            fullPage,
            omitBackground
          },
          isClipEmpty = isEveryValueFalsy( clip ),
          options = isClipEmpty ? baseOptions : { ...baseOptions, clip };

    if ( !isClipEmpty && isSomeValueNull( clip ) ) {
      throw new Error( "You have to provide either all clip parameters or none" );
    }

    const optArg = isEveryValueFalsy( options ) ? ` ` : `, ${ JSON.stringify( options ) } `,
          makeScreenshotCode = `await ${ renderPage( window ) }.screenshot( util.png( ${ JSON.stringify( id ) }, `
            + `${ parentId ? JSON.stringify( parentId ) : "null" }, ${ parser.stringify( name ) }${ optArg }) )`;

    return `
      // Taking screenshot of ${ isClipEmpty ? "the page" : "the specified region" }${
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
  toGherkin: ({ params }) => `Take screenshot \`${ params.name }\` of the open page`,

  requiresTargets: true,

  description: `Takes a screenshot of the page or a specified region.`,

  validate: ( values ) => {
    const { x, y, width, height, fullPage, omitBackground } = values.params;
    if ( x !== null || y !== null || width !== null || height !== null ) {
      if ( x === null || y === null || width === null || height === null ) {
        return "You have to provide either all clip parameters or none";
      }
      if ( fullPage || omitBackground ) {
        return "You can provide either clip parameters or fullpage / omit background";
      }
    }

    return null;
  },

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
          initialValue: ( record ) => `Page ${ getCounter( record.id ) || "" }`,
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
          name: "params.fullPage",
          label: "fullpage",
          control: CHECKBOX,
          tooltip: `When true, takes a screenshot of the full scrollable page.`,
          initialValue: false,
          placeholder: "",
          rules: []
        },
        {
          name: "params.omitBackground",
          label: "omit background",
          control: CHECKBOX,
          tooltip: `Hides default white background and allows capturing screenshots with transparency.`,
          initialValue: false,
          placeholder: "",
          rules: []
        }
      ]
    },

    {
      collapsed: true,
      tooltip: "An object which specifies clipping region of the page.",
      fields: [
        {
          name: "params.x",
          control: INPUT_NUMBER,
          label: "x (px)",
          initialValue: null
        },
        {
          name: "params.y",
          control: INPUT_NUMBER,
          label: "y (px)",
          initialValue: null
        },
        {
          name: "params.width",
          control: INPUT_NUMBER,
          label: "width (px)",
          initialValue: null
        },
        {
          name: "params.height",
          control: INPUT_NUMBER,
          label: "height (px)",
          initialValue: null
        }

      ]
    }

  ],

  testTypes: {
    "params": {
      "name": "INPUT",
      "fullPage": "CHECKBOX",
      "omitBackground": "CHECKBOX",
      "x": "INPUT_NUMBER",
      "y": "INPUT_NUMBER",
      "width": "INPUT_NUMBER",
      "height": "INPUT_NUMBER"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "name": "Page 1",
        "fullPage": false,
        "omitBackground": false,
        "x": null,
        "y": null,
        "width": null,
        "height": null
      }
    }
  ]
};
