import { INPUT, INPUT_NUMBER, CHECKBOX } from "../../constants";
import { isEveryValueMissing, isSomeValueMissing, ruleValidateGenericString } from "service/utils";
import ExpressionParser from "service/ExpressionParser";

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
          isClipEmpty = isEveryValueMissing( clip ),
          options = isClipEmpty ? baseOptions : { ...baseOptions, clip };

    if ( !isClipEmpty && isSomeValueMissing( clip ) ) {
      throw new Error( "You have to provide either all clip parameters or none" );
    }

    const optArg = isEveryValueMissing( options ) ? ` ` : `, ${ JSON.stringify( options ) } `;
    return `
      // Taking screenshot of ${ isClipEmpty ? "the page" : "the specified region" }
      await bs.page.screenshot( png( "${ parser.stringify( name ) }"${ optArg }) );
  `;
  },
  description: `Takes a screenshot of the page or a specified region.`,
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
          initialValue: "",
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
      span: { label: 4, input: 18 },
      tooltip: "An object which specifies clipping region of the page.",
      fields: [
        {
          name: "params.x",
          control: INPUT_NUMBER,
          label: "x (px)",
          tooltip: "",
          placeholder: "",
          rules: []
        },
        {
          name: "params.y",
          control: INPUT_NUMBER,
          label: "y (px)",
          tooltip: "",
          placeholder: "",
          rules: []
        },
        {
          name: "params.width",
          control: INPUT_NUMBER,
          label: "width (px)",
          tooltip: "",
          placeholder: "",
          rules: []
        },
        {
          name: "params.height",
          control: INPUT_NUMBER,
          label: "height (px)",
          tooltip: "",
          placeholder: "",
          rules: []
        }

      ]
    }

  ]
};
