import { buildAssertionTpl } from "service/assert";
import ExpressionParser from "service/ExpressionParser";
import { INPUT, INPUT_NUMBER, TEXTAREA } from "../../constants";

export const assignVar = {
  template: ({ params, id }) => {
    const parser = new ExpressionParser( id ),
          value = parser.stringify( params.value );
    return `
      // Assign template variable dynamically
      ENV[ ${ JSON.stringify( params.name ) } ] = ${ value };`;
  },
  description: `Assigns template variable dynamically`,

  params: [
    {
      legend: "",
      description: "",
      tooltip: "",
      span: { label: 4, input: 18 },
      fields: [
        {
          name: "params.name",
          control: INPUT,
          label: "Variable name",
          description: `Template variable that takes in remotely delivered value`,
          rules: [{
            required: true,
            message: "This field is required"
          },
          {
            validator: ( rule, value, callback ) => {
              const reConst = /^[A-Z_\-0-9]+$/g;
              if ( !value ) {
                callback( `Field is required.` );
              }
              if ( !value.match( reConst ) ) {
                callback( `Shall be in all upper case with underscore separators` );
              }
              callback();
            }
          }
          ]
        },
        {
          name: "params.value",
          control: INPUT,
          label: "Value",
          description: `You can use [template expressions](https://docs.puppetry.app/template)`,
          rules: [{
            required: true,
            message: "This field is required"
          }]
        }
      ]
    }
  ]
};
