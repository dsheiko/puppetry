import { justify } from "service/assert";
import { INPUT, CHECKBOX } from "../../constants";
import ExpressionParser from "service/ExpressionParser";
import { renderTarget } from "service/utils";

export const type = {
  template: ({ target, params, id }) => {
    const parser = new ExpressionParser( id );
    return justify(
      `// Emulating user input\n`
    + ( params.reset ? `await ( ${ renderTarget( target ) } ).click({ clickCount: 3 });\n` : "" )
    + `await ( ${ renderTarget( target ) } ).type( ${ parser.stringify( params.value ) } );` );
  },

  toLabel: ({ params }) => `(\`${ params.value }\`)`,
  toGherkin: ({ target, params }) => `Type \`${ params.value }\` into \`${ target }\``,
  commonly: "",

  description: `Focuses the element, and then sends keyboard events for each character in the text`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          template: true,
          control: INPUT,
          label: "A text to type",
          help: "",
          placeholder: "e.g. Jon Snow",
          initialValue: "",
          rules: [{
            required: true,
            message: "Text required"
          }]
        },
        {
          name: "params.reset",
          label: "replace the value",
          control: CHECKBOX,
          tooltip: `Normally the provided text gets added to the existing one. This option allows to replace it.`,
          initialValue: false,
          placeholder: "",
          rules: []
        }
      ]
    }
  ],

  testTypes: {
    "params": {
      "value": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "value": "val"
      }
    }
  ]
};
