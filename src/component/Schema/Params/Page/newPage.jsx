import { SELECT, INPUT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing, renderPage } from "service/utils";
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

export const newPage = {
  /**
   * @param {TemplatePayload} payload
   * @returns {String}
   */
  template: ({ window }) => {
    return `
      // Open a new empty browser tab
      await bs.newPage( "${ window }" );
    `;
  },

  description: "Open a new empty browser tab",

  toLabel: () => `()`,
  commonly: "open new tab",

  toGherkin: ({ params }) => `Open new tab`,

  params: [

  ],

  testTypes: {
  },

  test: [
  ]
};
