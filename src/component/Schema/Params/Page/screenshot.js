import { INPUT, INPUT_NUMBER, CHECKBOX } from "../../constants";
import { isEveryValueFalsy, isSomeValueNull, ruleValidateGenericString } from "service/utils";
import ExpressionParser from "service/ExpressionParser";
import { truncate } from "service/utils";
import { getCounter } from "service/screenshotCounter";

export const screenshot = {
  template: ({ params, id }) => {
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

    const optArg = isEveryValueFalsy( options ) ? ` ` : `, ${ JSON.stringify( options ) } `;
    return `
      // Taking screenshot of ${ isClipEmpty ? "the page" : "the specified region" }
      await bs.page.screenshot( util.png( ${ JSON.stringify( id ) }, ${ parser.stringify( name ) }${ optArg }) );
  `;
  },

  toLabel: ({ params }) => `(\`${ params.name }\`)`,
  commonly: "make screenshot",
  toGherkin: ({ params }) => `Take screenshot \`${ params.name }\` of the open page`,

  description: `Takes a screenshot of the page or a specified region.`,

  validate: ( values ) => {
    const { x, y, width, height } = values.params;
    if ( x !== null || y !== null || width !== null || height !== null ) {
      if ( x === null || y === null || width === null || height === null ) {
        return "You have to provide either all clip parameters or none";
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
          name: "params.fullPage",
          label: "fullpage",
          control: CHECKBOX ,
          tooltip: `When true, takes a screenshot of the full scrollable page.`,
          initialValue: false,
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
