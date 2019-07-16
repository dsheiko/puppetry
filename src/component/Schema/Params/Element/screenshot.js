import { INPUT, CHECKBOX } from "../../constants";
import { isEveryValueMissing, ruleValidateGenericString } from "service/utils";
import ExpressionParser from "service/ExpressionParser";
import { truncate } from "service/utils";

let counterCache = new Set(), counter = 0;
/**
 * the logic is that complex because
 * ParamsFormBuilder re-renders with onChange event and simple counter
 * would iterate every time
 * @param {string} id
 * @returns {Number}
 */
function getCounter( id ) {
  if ( counterCache.has( id ) ) {
    return counter;
  }
  counterCache.add( id );
  counter++;
  return counter;
}

export const screenshot = {
  template: ({ target, params, id }) => {
    const { name, omitBackground } = params,
          parser = new ExpressionParser( id ),
          baseOptions = {
            omitBackground
          },
          options = baseOptions,

          optArg = isEveryValueMissing( options ) ? ` ` : `, ${ JSON.stringify( options ) } `;
    return `
      // Taking screenshot of ${ target } element
      await ( await ${ target }() ).screenshot( util.png( ${ parser.stringify( name ) }${ optArg }) );
  `;
  },

  toLabel: ({ params }) => `(\`${ truncate( params.name, 80 ) }\`)`,
  toText: ({ params }) => `(\`${ params.name }\`)`,
  commonly: "make screenshot",

  description: `Takes a screenshot of the target element.`,

  test: {
    "params": {
      "name": "Screenshot"
    }
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

  ]
};
