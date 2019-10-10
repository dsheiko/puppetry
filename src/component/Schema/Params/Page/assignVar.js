import ExpressionParser from "service/ExpressionParser";
import { INPUT } from "../../constants";
import { truncate } from "service/utils";

export const assignVar = {
  template: ({ params, id }) => {
    const parser = new ExpressionParser( id ),
          value = parser.stringify( params.value );
    return `
      // Assign template variable dynamically
      ENV[ ${ JSON.stringify( params.name ) } ] = ${ value };`;
  },


  toLabel: ({ params }) => `(\`${ params.name }\`, \`${ params.value }\`)`,
  toGherkin: ({ params }) => `Set value \`${ params.value }\` to template variable ${ params.name }`,

  commonly: "set template variable dynamically",

  description: `Assigns template variable dynamically`,

  params: [
    {
      legend: "",
      description: "",
      tooltip: "",
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
