import { justify } from "service/assert";
import { INPUT } from "../../constants";
import { truncate } from "service/utils";

export const select = {
  template: ({ params, targetSeletor }) => justify(
    `// Emulating select\n`
    + `await bs.page.select( "${ targetSeletor }", "${ params.value }" );` ),

  toLabel: ({ params }) => `(\`${ params.value }\`)`,
  toGherkin: ({ target, params }) => `Select \`${ params.value }\` in \`${ target }\``,
  commonly: "",


  description: `Sets value on select element`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          control: INPUT,
          label: "Option value",
          help: "",
          placeholder: "e.g. foo",
          initialValue: "",
          rules: [{
            required: true,
            message: "Text required"
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
        "value": "aaa"
      }
    }
  ]
};
