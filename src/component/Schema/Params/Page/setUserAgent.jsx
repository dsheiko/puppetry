import { INPUT } from "../../constants";
import ExpressionParser from "service/ExpressionParser";

/**
 * @typedef {object} TemplatePayload
 * @property {string} target
 * @property {string} method
 * @property {object} assert
 * @property {object} params
 * @property {string} targetSeletor
 * @property {string} id - command id
 */

export const setUserAgent = {
  /**
   * @param {TemplatePayload} payload
   * @returns {String}
   */
  template: ({ params, id }) => {
    const { value } = params,
          parser = new ExpressionParser( id ),
          valString = parser.stringify( value );
    return `
      // Set custom UserAgent
      await bs.page.setUserAgent( ${ valString } );
    `;
  },

  description: "Set custom UserAgent",

  toLabel: ({ params }) => `(\`${ params.value }\`)`,
  commonly: "set user-agent",

  toGherkin: ({ params }) => `Set custom UserAgent \`${ params.value }\``,

  params: [
    {
      legend: "",
      description: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          template: true,
          control: INPUT,
          label: "UserAgent",
          placeholder: "e.g. Mozilla/5.0 (PlayStation 4 5.01) AppleWebKit/601.2 (KHTML, like Gecko)",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
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
        "value": "Mozilla/5.0 (PlayStation 4 5.01) AppleWebKit/601.2 (KHTML, like Gecko)"
      }
    }
  ]
};
